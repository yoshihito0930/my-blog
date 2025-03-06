---
title: "Reactのバリデーション関数"
tags: ['React']
image: "/assets/tags/aws.png"
publishedAt: 2023-11-11
modifiedAt:
draft: false
---
# はじめに
とあるシステムで、予約フォームを作成することになりました。  
フロントエンドはReactで作成しています。  

今回はバリデーション関数についていくつか調べて実装したので、備忘も兼ねてまとめておきます。  

# バリデーション関数とは
そもそもバリデーション関数ってなんぞや？  
という話からです。  

予約フォームを入力するとき、記入事項に漏れがあったりすると「入力必須の項目が漏れています」  
などのアラート文が表示されるかと思います。  
あれです。  

バリデーション関数を実装することで、次のことができるようになります。  
- データ整合性の統一
- 必須項目が漏れたままフォーム入力完了を防ぐ

# 具体的な実装方法
Reactでバリデーション関数を実装する場合、主に次の二つのイベントハンドラーを使って実装します。  
イベントハンドラーの中でバリデーション関数を呼び出します。  

- handleChange
- handleBlur

それぞれ具体的に見ていきましょう。  

## handleChange
フォームの入力値が変更されたときに呼び出されるイベントハンドラーです。  
ユーザが項目を入力するたびに、入力欄のバリデーションを確認してエラーハンドリングをしています。  
つまり、文字を打つたびにエラーが画面に表示されます。  

## handleBlur
入力フィールドからフォーカスが外れたときに呼び出されるイベントハンドラーです。  
ユーザが入力を完了した後、次の項目に移った時にエラーが出力されます。  

## バリデーション関数の実装
では、具体的にバリデーション関数はどんな内容になるのかをサンプルコードで記載したいと思います。  

``` React:validateEmail
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
```
メールアドレスの入力欄に対して実装するバリデーション関数です。  
@が入っているかどうかで判定をする正規表現を組み込んでいます。  

```React:validateNotBlank
const validateNotBlank = (value) => {
    return value.trim() !== '';
};
```
必須入力の欄に実装するバリデーション関数です。  
空白のままの場合にエラーが表示されます。  

```React:validatePhoneNumber
const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10,11}$/;
    return phoneRegex.test(phoneNumber);
};
```
電話番号を入力する欄に実装するバリデーション関数です。  
このコードでは10桁、あるいは11桁の数値で判定しています。  

```React:validateCheckbox
const validateCheckbox = (checked) => {
    return checked;
};
```
チェックボックスにチェックがされているかを判定するバリデーション関数です。  

## サンプルコード
```React:nameForm
import React, { useState } from 'react';

const nameForm = () => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  const validateName = () => {
    if (name.trim() === '') {
      setNameError('名前を入力してください');
    } else {
      setNameError('');
    }
  };

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleBlur = () => {
    validateName();
  };

  return (
    <div>
      <label htmlFor="name">名前</label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {nameError && <p style={{ color: 'red' }}>{nameError}</p>}
    </div>
  );
};

export default nameForm;
```

# さいごに
今回はバリデーション関数を呼び出すためのイベントハンドラーについて簡単にまとめました。  
バリデーション関数の実装などは適宜更新していこうと思います。  

誤っている内容がありましたら指摘いただけると嬉しいです！  