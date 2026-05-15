# GitHub Secrets 配置指南

## 需要配置的 Secrets

进入仓库 Settings → Secrets and variables → Actions → New repository secret

### 1. 签名配置（Android 打包需要）

| Secret Name | Value | 说明 |
|------------|-------|------|
| `KEYSTORE_BASE64` | base64 编码的 keystore 文件 | `base64 -i universal.keystore` |
| `KEYSTORE_PASSWORD` | universal2024 | storePassword |
| `KEY_PASSWORD` | universal2024 | keyPassword |
| `KEY_ALIAS` | universalkey | keyAlias |

生成 base64：
```bash
base64 -i universal.keystore -o keystore.base64.txt
cat keystore.base64.txt | pbcopy  # macOS
```

### 2. GitHub Token（用于发布）

| Secret Name | Value |
|------------|-------|
| `GH_TOKEN` | 你的 GitHub Personal Access Token |

### 3. 可选：部署配置

| Secret Name | Value |
|------------|-------|
| `SERVER_IP` | 你的服务器IP |
| `SERVER_USER` | root |
| `SERVER_PASSWORD` | 你的服务器密码 |

## 配置步骤

1. 打开仓库 Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. 输入 Name 和 Value
4. 点击 "Add secret"
5. 重复上述步骤添加所有 secrets

## 验证配置

推送代码后，在 Actions 页面查看构建状态。
