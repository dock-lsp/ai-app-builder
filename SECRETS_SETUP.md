# GitHub Secrets 配置步骤

## 访问链接
https://github.com/dock-lsp/ai-app-builder/settings/secrets/actions

## 需要添加的 4 个 Secrets

### 1. KEYSTORE_BASE64
值在下方（完整的 base64 字符串）

### 2. KEYSTORE_PASSWORD
`universal2024`

### 3. KEY_PASSWORD  
`universal2024`

### 4. KEY_ALIAS
`universalkey`

## 配置步骤

1. 打开 Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. 添加以上 4 个 secrets
4. 完成后触发构建

## 触发构建

访问 Actions → Build Mobile Apps → Run workflow
