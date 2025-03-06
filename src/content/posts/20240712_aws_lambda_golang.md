---
title: "AWS Lambda関数をGolangで実装し、Github Actionsで構築自動化してみた"
tags: ['AWS', 'Golang', 'GithubActions']
image: "/assets/tags/aws.png"
publishedAt: 2024-07-12
modifiedAt:
draft: false
---

## 1. はじめに
この記事では、AWS Lambda関数をGolangで実装し、その更新を手動および自動化する方法について解説します。  
特に、GitHub Actionsを用いた構築自動化の手法に焦点を当てます。  

## 2. AWS Lambdaとは
AWS Lambdaは、イベント駆動型のサーバーレスコンピューティングサービスです。  
ユーザーはインフラストラクチャを管理することなくコードを実行できます。  
https://aws.amazon.com/jp/lambda/

## 3. GolangでのLambda関数実装
### 3.1 Golangの環境構築
※他記事を参考にしてください。  

### 3.2 簡単なLambda関数の作成
今回、Lambdaはコンテナイメージで実装しています。  
  
コンテナイメージにする利点や具体的な実装詳細については[エムスリーさんのテックブログ](https://www.m3tech.blog/entry/2023/08/31/110000)を参考にしました。  
以下は要点です：
- GolangでのLambda関数作成手順
- AWS Lambda用のハンドラ関数の書き方
- ビルドとデプロイの方法

### 3.3 デプロイ
作成したLambda関数をAWSにデプロイするための準備を行います。詳細な手順は公式ドキュメントをご覧ください。

## 4. Lambda関数の手作業での更新
この記事の本題です。  
コンテナイメージで実装したLambda関数を更新する場合は、以下の作業が発生します。  
なお、コンテナイメージはECR上に保管することとします。

### 1. dockerイメージの構築
```bash
docker build --platform linux/arm64 -t docker-image:test .
```

### (ECRへログイン)
```bash
aws ecr get-login-password --region {リージョン名} | docker login --username AWS --password-stdin {ECRのURI}
```

### 2. ローカルイメージを、ECRリポジトリにタグ付け
```bash
docker tag docker-image:test {ECRのURI}:latest
```

### 3. ローカルイメージを、ECRリポジトリにpush
```bash
docker push {ECRのURI}:latest
```

### 4. Lambda関数を更新
``` bash
aws lambda update-function-code \
  --function-name {Lambda関数名} \
  --image-uri {ECRのURI}:latest \
  --architectures arm64 
```

ここまで読んでいただければお分かりかと思いますが、これを手作業でやると結構面倒です。  
- 単純作業ではあるものの、作業が多い
- 1回の更新に意外と時間がかかる

コードをGithubリポジトリで管理していたので、Github Actionsで自動化できました。  

## 5. Lambda関数の更新を自動化
### 5.1 GitHub Actionsとは
GitHub Actionsは、GitHubが提供する継続的インテグレーションおよび継続的デリバリー（CI/CD）ツールです。  
これにより、コードのビルド、テスト、デプロイを自動化できます。

- **ワークフロー**:  
  GitHub Actionsでは、ワークフローと呼ばれる設定ファイル（YAML形式）を使って、自動化する手順を定義します。  
  ワークフローは特定のイベント（例えば、コードのプッシュやプルリクエストの作成）に応じてトリガーされます。
- **ジョブとステップ**:  
  ワークフローは複数のジョブから構成され、それぞれのジョブは一連のステップを持ちます。  
  ステップは、コマンドやスクリプトの実行を指します。
- **ランナー**:  
  ジョブはランナーと呼ばれるサーバーで実行されます。  
  ランナーはGitHubが提供するものを使うことも、自分でホストすることもできます。  

GitHub Actionsを使うことで、開発者はコードの変更が自動的にテストされ、本番環境にデプロイされるまでのプロセスをスムーズに管理できます。

### 5.2 GitHubリポジトリの準備
Lambda関数のコードをホストするGitHubリポジトリを設定します。

### 5.3 ワークフローの設定
GitHub Actionsのワークフローを設定し、Lambda関数のデプロイを自動化します。

```yaml
name: Deploy to AWS Lambda

  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout repository
      uses: actions/checkout@v2

    - name: Set up QEMU
      uses: docker/setup-qemu-action@v2

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2

    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: {リージョン名}

    - name: Login to ECR
      run: |
        aws ecr get-login-password --region {リージョン名} | docker login --username AWS --password-stdin {ECRのURI}

    - name: Build Docker image
      run: docker build --platform linux/arm64 -t docker-image:test .

    - name: Tag Docker image
      run: docker tag docker-image:test {ECRのURI}:latest

    - name: Push Docker image to ECR
      run: docker push {ECRのURI}:latest

    - name: Update Lambda function
      run: |
        aws lambda update-function-code \
          --function-name {Lambda関数名} \
          --image-uri {ECRのURI}:latest \
          --architectures arm64 
```

## 6. おわりに
CI/CDを構築すると、かなり開発体験が向上しました。  
めちゃくちゃ便利なので、ぜひ皆様も試してみてください。