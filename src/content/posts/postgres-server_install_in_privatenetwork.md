---
title: "ネットワーク接続できないEC2(Linux)で、postgresql-serverをインストールする方法"
tags: ['AWS', 'RHEL', 'PostgreSQL']
image: "/assets/tags/aws.png"
publishedAt: 2025-03-05
modifiedAt:
draft: false
---
## はじめに
業務の都合上、インターネットに接続できない環境は多々あるはず。  
私もインターネットに接続できない環境で、RHEL上にPostgreSQL Serverをインストールする方法を調べて実行したので  
アウトプットとして記録する。  

通常、`dnf install postgresql-server` を実行するにはインターネット接続が必要だが、  
本記事では **ISOファイルを利用したオフラインインストールの方法** を紹介する。

## 前提
- EC2インスタンスをRHEL8で作成済み
- インターネットに接続できない環境であること

## 概要
ローカルのISOファイルをマウントし、ローカルリポジトリを設定してpsqlをインストールする。  
大まかな手順を以下に記載する。  
- ISOファイルをマウント
- ローカルリポジトリを設定
- dnfのキャッシュをクリアして更新
- postgresql-serverのインストール

## 詳細
### ISOファイルをマウント
私が作成したEC2インスタンスには、/media配下にISOファイルが存在していたため、以下コマンドでマウントする。
```
sudo mount -o loop /media/rhel-8.1-x86_64-dvd.iso /mnt
```

### ローカルリポジトリを設定
以下コマンドで、ローカルリポジトリを設定する。
```
sudo tee /etc/yum.repos.d/local.repo <<EOF
[LocalRepo-BaseOS]
name=Local Repository BaseOS
baseurl=file:///mnt/BaseOS
enabled=1
gpgcheck=0

[LocalRepo-AppStream]
name=Local Repository AppStream
baseurl=file:///mnt/AppStream
enabled=1
gpgcheck=0
EOF
```

また、Red Hat のクラウド向けリポジトリ（RHUI: Red Hat Update Infrastructure）が存在している場合、  
インターネットに接続できないため、以下のようなエラーが出る場合がある。
```
Failed to download metadata for repo 'rhui-client-config-server-8'
ERROR: Failed to download metadata for repo 'rhui-client-config-server-8'
```

この場合、以下コマンドでRHUIリポジトリを無効化する必要がある。
```
sudo dnf config-manager --disable rhui-rhel-8-*
sudo dnf config-manager --disable rhui-client-config-server-*
```

### dnfのキャッシュをクリアして更新
ローカルリポジトリを有効にするため、キャッシュをクリアして更新する。
```
sudo dnf clean all
sudo dnf makecache
```

ローカルリポジトリが認識されているか確認
```
dnf repolist
```

以下のような出力例が出れば成功。
```
repo id                  repo name                     status
LocalRepo-BaseOS         Local Repository BaseOS       4,567
LocalRepo-AppStream      Local Repository AppStream    3,210
```

### postgresql-serverのインストール
以下コマンドでインストール。
```
sudo dnf install -y postgresql

# バージョン確認
psql --version
```

## 補足
### マウントとは？
「マウント」とは、コンピュータがストレージデバイス（CD/DVD、USBメモリ、ISOファイルなど）のデータを直接読み書きできるようにする操作のこと。  
ISOファイルは単なるディスクイメージだが、マウントすることで **CD/DVDドライブのようにアクセス** できる。  
今回の手順では、ISO内のパッケージを使用するため、 `/mnt` にマウントしてリポジトリとして利用している。
