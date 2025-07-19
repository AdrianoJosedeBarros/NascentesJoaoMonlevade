# 🔐 Guia de Autenticação GitHub

## ❌ Problema Encontrado

O push falhou com erro 403, indicando que é necessário autenticação.

## 🔧 Soluções

### Opção 1: Token de Acesso Pessoal (Recomendado)

1. **Criar Token no GitHub:**
   - Acesse: https://github.com/settings/tokens
   - Clique em **"Generate new token (classic)"**
   - Selecione **"repo"** (acesso completo aos repositórios)
   - Clique **"Generate token"**
   - **Copie o token** (você só verá uma vez!)

2. **Usar o Token:**
   ```bash
   # Substitua YOUR_TOKEN pelo token gerado
   & "C:\Program Files\Git\bin\git.exe" push https://YOUR_TOKEN@github.com/AdrianoJosedeBarros/NascentesJoaoMonlevade.git main
   ```

### Opção 2: GitHub CLI

1. **Instalar GitHub CLI:**
   - Baixe em: https://cli.github.com/
   - Ou use: `winget install GitHub.cli`

2. **Autenticar:**
   ```bash
   gh auth login
   ```

3. **Fazer Push:**
   ```bash
   & "C:\Program Files\Git\bin\git.exe" push -u origin main
   ```

### Opção 3: Configurar Credenciais

1. **Configurar credenciais:**
   ```bash
   & "C:\Program Files\Git\bin\git.exe" config --global credential.helper manager-core
   ```

2. **Tentar push novamente:**
   ```bash
   & "C:\Program Files\Git\bin\git.exe" push -u origin main
   ```

## 🚀 Comando Final

Após configurar a autenticação, execute:

```bash
& "C:\Program Files\Git\bin\git.exe" push -u origin main
```

## 📋 Próximos Passos

1. ✅ Resolver autenticação
2. ✅ Fazer push para GitHub
3. ✅ Configurar GitHub Pages
4. ✅ Acessar URL pública

## 🌐 URL Final

Após o deploy: **https://adrianojosedebarros.github.io/NascentesJoaoMonlevade/**

---

*Escolha a opção que preferir e execute os comandos correspondentes.* 