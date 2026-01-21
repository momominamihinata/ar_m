# ドキュメント

器ARコーディネートアプリケーションの包括的なドキュメントへようこそ。

## ドキュメント一覧

### 📘 [README.md](../README.md)
**プロジェクトの概要とクイックスタート**

- アプリケーションの概要
- 主な機能の説明
- セットアップ手順
- 使い方ガイド
- トラブルシューティング

👉 **最初にこちらを読んでください**

---

### 🏗️ [ARCHITECTURE.md](./ARCHITECTURE.md)
**アーキテクチャ設計書**

- システムアーキテクチャの全体像
- レイヤー構成の詳細
- データフローの説明
- 状態管理の設計
- 技術選定の理由とトレードオフ
- パフォーマンス最適化戦略

👉 **アプリケーションの設計思想を理解したい開発者向け**

---

### 📚 [API.md](./API.md)
**API リファレンス**

- Store API（Zustand）
- 画像処理 API
- デバイス検出 API
- TypeScript型定義
- コンポーネントAPI
- 使用例とベストプラクティス

👉 **コードを書く開発者向けのリファレンス**

---

### 🤝 [CONTRIBUTING.md](./CONTRIBUTING.md)
**貢献ガイドライン**

- 貢献の方法（バグ報告、機能リクエスト、コード貢献）
- 開発環境のセットアップ
- コーディング規約
- コミットメッセージの規約
- プルリクエストのガイドライン
- 開発のヒントとトラブルシューティング

👉 **プロジェクトに貢献したい方向け**

---

## ドキュメントの構成

```
my-app/
├── README.md                    # プロジェクトのメインドキュメント
└── docs/
    ├── README.md               # このファイル（ドキュメントインデックス）
    ├── ARCHITECTURE.md         # アーキテクチャ設計書
    ├── API.md                  # API リファレンス
    └── CONTRIBUTING.md         # 貢献ガイドライン
```

## ドキュメントの読み方

### 初めての方

1. **[README.md](../README.md)** - アプリケーションの概要と使い方を理解
2. セットアップしてローカルで実行
3. 実際に使ってみる

### 開発を始める方

1. **[README.md](../README.md)** - セットアップと環境構築
2. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - アーキテクチャを理解
3. **[API.md](./API.md)** - APIリファレンスを参照しながら開発
4. **[CONTRIBUTING.md](./CONTRIBUTING.md)** - コーディング規約とワークフローを確認

### 貢献したい方

1. **[CONTRIBUTING.md](./CONTRIBUTING.md)** - 貢献の方法とガイドラインを確認
2. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - システム全体を理解
3. **[API.md](./API.md)** - 既存のAPIを理解
4. コードを書いてプルリクエストを送る

## よくある質問

### Q: どこから読み始めればいい？

**A:** まず [README.md](../README.md) を読んで、アプリケーションの概要とセットアップ方法を理解してください。

### Q: コードを書きたいが、どのファイルを参照すべき？

**A:** [API.md](./API.md) でAPIリファレンスを確認し、[ARCHITECTURE.md](./ARCHITECTURE.md) でシステム全体の設計を理解してください。

### Q: バグを見つけたが、どうすればいい？

**A:** [CONTRIBUTING.md](./CONTRIBUTING.md) の「問題報告」セクションを参照して、GitHubでIssueを作成してください。

### Q: 新しい機能を追加したいが、どうすればいい？

**A:** [CONTRIBUTING.md](./CONTRIBUTING.md) を読んで、開発ワークフローとプルリクエストのガイドラインに従ってください。

### Q: このアプリはどのような技術で作られている？

**A:** Next.js 16、React 19、TypeScript、Tailwind CSS、Zustandを使用しています。詳細は [README.md](../README.md) の「技術スタック」セクションを参照してください。

### Q: データはどこに保存される？

**A:** 現在、すべてのデータはブラウザのメモリ内に保存されます。ページをリロードするとリセットされます。詳細は [ARCHITECTURE.md](./ARCHITECTURE.md) を参照してください。

### Q: iOSとAndroidで機能が違う？

**A:** はい。iOSではカメラARモードが利用可能ですが、Androidでは2D配置モードのみです。詳細は [README.md](../README.md) を参照してください。

---

## ドキュメントの更新

ドキュメントに誤りや改善点を見つけた場合:

1. GitHubでIssueを作成
2. または、プルリクエストで修正を提案

ドキュメントもコードと同様に重要です。貢献を歓迎します！

---

## 追加リソース

### 外部リソース

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

### 関連技術

- [@imgly/background-removal](https://github.com/imgly/background-removal-js) - 背景除去ライブラリ
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) - 画像処理
- [MediaDevices API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices) - カメラアクセス

---

## フィードバック

ドキュメントに関するフィードバックは大歓迎です。

- 分かりにくい箇所
- 追加してほしい情報
- 誤字・脱字

GitHubのIssueまたはPRでお知らせください。

---

最終更新日: 2026-01-21
