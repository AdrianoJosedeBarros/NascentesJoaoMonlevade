# 🚀 Instruções para Deploy no GitHub Pages

## 📋 Pré-requisitos

1. **Git instalado** no seu computador
2. **Conta no GitHub** com o repositório criado
3. **Todos os arquivos** do WebGIS organizados

## 🔧 Passos para Deploy

### 1. Instalar Git (se necessário)

**Windows:**
- Baixe em: https://git-scm.com/download/win
- Instale seguindo as instruções padrão

**macOS:**
```bash
brew install git
```

**Linux:**
```bash
sudo apt-get install git
```

### 2. Configurar Git

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
```

### 3. Inicializar Repositório Local

```bash
# Navegar até a pasta do projeto
cd C:\Users\Daxam\Desktop\GIS\data

# Inicializar git
git init

# Adicionar remote
git remote add origin https://github.com/AdrianoJosedeBarros/NascentesJoaoMonlevade.git
```

### 4. Adicionar Arquivos

```bash
# Adicionar todos os arquivos
git add .

# Verificar status
git status
```

### 5. Fazer Commit

```bash
git commit -m "Initial commit: WebGIS Nascentes João Monlevade"
```

### 6. Fazer Push

```bash
# Primeira vez (criar branch main)
git branch -M main
git push -u origin main
```

## 🌐 Configurar GitHub Pages

### Opção 1: Branch Main (Recomendado)

1. Vá para: https://github.com/AdrianoJosedeBarros/NascentesJoaoMonlevade
2. Clique em **Settings** (Configurações)
3. Role para baixo até **Pages**
4. Em **Source**, selecione **Deploy from a branch**
5. Em **Branch**, selecione **main** e **/(root)**
6. Clique **Save**

### Opção 2: Pasta /docs

Se preferir usar uma pasta específica:

1. Crie uma pasta `docs` no repositório
2. Mova todos os arquivos para dentro dela
3. Configure GitHub Pages para usar a pasta `/docs`

## 📁 Estrutura de Arquivos

```
NascentesJoaoMonlevade/
├── index.html              # Página principal
├── styles.css              # Estilos CSS
├── script.js               # JavaScript
├── README.md               # Documentação
├── LICENSE                 # Licença MIT
├── .gitignore             # Arquivos ignorados
├── Nascentes.geojson      # Dados das nascentes
├── Ruas.geojson           # Rede viária
├── Monlevade.geojson      # Limites municipais
├── Informaçoes Bairros.geojson  # Bairros
└── Estruturas Urbanas.geojson   # Estruturas urbanas
```

## 🔍 Verificar Deploy

1. Aguarde alguns minutos após o push
2. Acesse: https://adrianojosedebarros.github.io/NascentesJoaoMonlevade/
3. Verifique se todas as funcionalidades estão funcionando

## 🐛 Solução de Problemas

### Erro 404
- Verifique se o arquivo `index.html` está na raiz
- Confirme se o GitHub Pages está configurado corretamente

### Arquivos não carregam
- Verifique se todos os arquivos GeoJSON estão no repositório
- Confirme se os caminhos nos arquivos JS estão corretos

### Erro de CORS
- GitHub Pages não tem problemas de CORS
- Se houver erro, verifique se está acessando via HTTPS

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do console do navegador
2. Confirme se todos os arquivos estão no repositório
3. Aguarde alguns minutos para o deploy ser concluído
4. Entre em contato se necessário

## 🎉 URL Final

Após o deploy bem-sucedido, o WebGIS estará disponível em:

**🌐 https://adrianojosedebarros.github.io/NascentesJoaoMonlevade/**

---

*Estas instruções garantem que seu WebGIS seja publicado corretamente no GitHub Pages e esteja acessível publicamente.* 