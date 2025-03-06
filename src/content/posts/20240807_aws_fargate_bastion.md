---
title: "AWS Fargate + セッションマネージャーをつかって、RDS接続用のbastionを構築する際に詰まったポイント"
tags: ['AWS']
image: "/assets/tags/aws.png"
publishedAt: 2024-08-07
modifiedAt:
draft: false
---

## はじめに
「AWSコンテナ設計・構築[本格]入門」という書籍に、  
AWS Fargateを使ったbastion設計の章があります。(Chapter5-7)  

個人開発している環境において、AWS Fargateとセッションマネージャーを使ったbastionを導入しようとしたのですが、  
なかなかうまく実装できませんでした。  

この記事では、実装するうえで行き詰った個所を振り返り、共有することを目的としています。  

## つまずいた箇所
今回つまずいたポイントは2か所です。  

2.1. private subnet上のECSから、ECRに保存されているコンテナイメージがpullできなかった  
2.2. Session Managerのアクティベーションコードを発行できなかった  

### 2.1. private subnet上のECSから、ECRに保存されているコンテナイメージがpullできなかった
ECRはリージョナルサービスのため、VPC内には存在しません。  
また、今回のECSはprivate subnet上に配置されています。  
つまりECSとECRの間に、次のいずれかがないと通信できません。  
(1)VPC Endpont  
(2)NAT Gateway  

(1)VPC Endpontを使う場合、インターネットへ出ることなくECRにアクセスでき、よりセキュアです。  
(2)の場合、インターネットへの接続が必要になるのと、データ通信料がコストとしてかかってきてしまいます。  
なるべくコストは抑えたかったので、(1)VPC Endpointを採用することにしました。  

ECS ⇔ ECR間の通信に必要なEndpointは次の3つです。
- ECR API ( com.amazonaws.<リージョン名>.ecr.api )  
　「aws ecr get-login-password」などのECR APIを呼び出す際に利用
- ECR DKR ( com.amazonaws.<リージョン名>.ecr.dkr )  
　「docker push」などのDockerクライアントコマンドの呼び出しに利用
- S3 ( com.amazonaws.<リージョン名>.s3 )  
　Dockerイメージの取得に利用

これらのエンドポイントは、ECSタスク用のセキュリティグループに対して設定されている必要があります。  
※S3はゲートウェイ型のためコストは発生しませんが、ECR APIおよびECR DKRはインターフェース型のため、コストがかかります。  

また、ECSタスクのログをCloudWatchへ保管するためのVPC Endpointも作成しました。  
- CloudWatch Logs ( com.amazonaws.<リージョン名>.logs )  

### 2.2. セッションマネージャーからECSタスクへ接続ができなかった
2.1. で無事にECSタスクが起動できるようになったのですが、  
次はセッションマネージャーからECSタスクへ接続ができない事象が発生しました。  
原因としては2つ考えられます。  
(1)IAM権限が不足している  
(2)ネットワーク設定が不足している  

#### (1)IAM権限が不足している
セッションマネージャーからECSタスクへ接続するためには、  
アクティベーションコードとIDを払い出し、  
タスク内のSSMエージェントに対して登録する  
必要があります。  
ECSタスク内でアクティベーションコードを発行するので、ECSタスクに対してSystems Managerを操作する権限が必要でした。  
また、アクティベーションコードを発行するコマンドでSystems Manager用のロールを指定する必要がありました。  
したがって、次の権限が必要になります。  
- ECSタスクが利用するロールとポリシー
- ECSタスクのロールにアタッチ

```terraform
# ECS TaskのIAMロールにSSM Activationのポリシーを追加
resource "aws_iam_role_policy" "ssm_activation_policy" {
  name = "ssm-activation-policy"
  role = aws_iam_role.ecs_task_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ssm:CreateActivation",
          "ssm:DeleteActivation",
          "iam:PassRole"
        ]
        Resource = "*"
      }
    ]
  })
}

# SSM Service Role (if not already existing)
resource "aws_iam_role" "ssm_service_role" {
  name = "SSMServiceRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ssm.amazonaws.com"
        }
      }
    ]
  })
}
```

- ECSタスクがアクティベーションコード発行時に指定するロール
``` terraform
resource "aws_iam_role_policy_attachment" "ssm_service_role_policy" {
  role       = aws_iam_role.ssm_service_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}
```

### (2)ネットワーク設定が不足している
Systems ManagerへのVPCエンドポイントとして、次の2つを作成する必要があります。
- ssm ( com.amazonaws.<リージョン名>.ssm )
　アクティベーションを作成するAPIなどで利用
- ssmmessages ( com.amazonaws.<リージョン名>.ssmmessages )
　セッションマネージャーの接続を確立するために利用

これらのエンドポイントは、VPCエンドポイント用のセキュリティグループを選択する必要があります。
```terraform
# VPCエンドポイント用のセキュリティグループ
resource "aws_security_group" "vpc_endpoint_sg" {
  name        = "vpc-endpoint-sg"
  description = "Security group for VPC endpoints"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.main.cidr_block]
  }
}
```

また、ECSとセッションマネージャーの通信を確立させるために、次のセキュリティグループも必要でした。
```terraform
resource "aws_security_group_rule" "ecs_to_vpc_endpoints" {
  type                     = "egress"
  from_port                = 443
  to_port                  = 443
  protocol                 = "tcp"
  security_group_id        = aws_security_group.ecs_security_group.id
  source_security_group_id = aws_security_group.vpc_endpoint_sg.id
}
```

# まとめ
上記の対応をすることで、無事にpraivate subnet上のECSタスクから、セッションマネージャーを利用して  
praivate subnet上のRDSへ接続することができました。  
大きくはネットワークの問題と権限周りの問題でした。  

また、VPCエンドポイントは存在しているだけでコストがかかるので、bastionを利用しないときは  
Terraformでコメントアウトして反映させています。  
この辺も自動化できる仕組みを考えたいです。  
  
本記事は「AWSコンテナ設計・構築[本格]入門」を参考にしていますので、まだ読んでない方はぜひ一読をおすすめします。  
  
https://www.amazon.co.jp/AWS%E3%82%B3%E3%83%B3%E3%83%86%E3%83%8A%E8%A8%AD%E8%A8%88%E3%83%BB%E6%A7%8B%E7%AF%89-%E6%9C%AC%E6%A0%BC-%E5%85%A5%E9%96%80-%E6%A0%AA%E5%BC%8F%E4%BC%9A%E7%A4%BE%E9%87%8E%E6%9D%91%E7%B7%8F%E5%90%88%E7%A0%94%E7%A9%B6%E6%89%80/dp/4815607656
