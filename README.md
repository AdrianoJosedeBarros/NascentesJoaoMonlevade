# 🌍 WebGIS Nascentes João Monlevade - MG

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-blue?style=for-the-badge&logo=github)](https://adrianojosedebarros.github.io/NascentesJoaoMonlevade/)
[![Leaflet.js](https://img.shields.io/badge/Leaflet.js-1.9.4-green?style=for-the-badge&logo=leaflet)](https://leafletjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

Uma aplicação WebGIS interativa desenvolvida com Leaflet.js para visualização e análise de dados geográficos da cidade de João Monlevade, Minas Gerais, com foco especial nas nascentes e recursos hídricos da região.

## 🚀 **Acesso Direto**

**🌐 [Acesse o WebGIS Online](https://adrianojosedebarros.github.io/NascentesJoaoMonlevade/)**

---

## 🗺️ Características

### Funcionalidades Principais
- **3 Camadas de Mapa Base**: Ruas (OpenStreetMap), Satélite (Esri) e Terreno (OpenTopoMap)
- **5 Camadas de Dados da Cidade**:
  - Bairros com informações demográficas
  - Estruturas Urbanas
  - Limites Municipais
  - Rede de Ruas com dados de tráfego
  - Nascentes com informações hidrológicas
- **Interface Responsiva**: Adaptação automática para Desktop e Mobile
- **Controle de Camadas**: Sidebar lateral com controles interativos
- **Ferramentas de Navegação**: Zoom, medição de distância, tela cheia
- **Análise Espacial**: Buffer analysis para nascentes com consulta por raio de influência
- **Popup Informativo**: Informações detalhadas sobre cada elemento

### Design e UX
- Interface moderna com gradientes e efeitos de vidro (glassmorphism)
- Animações suaves e transições
- Estilos diferenciados para cada camada
- Popup de boas-vindas com informações da cidade
- Barra de status com coordenadas, zoom e escala

## 🚀 Como Usar

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (devido ao carregamento de arquivos GeoJSON)

### Instalação e Execução

1. **Clone ou baixe os arquivos**:
   ```
   git clone [url-do-repositorio]
   cd webgis-joao-monlevade
   ```

2. **Inicie um servidor web local**:
   
   **Com Python 3:**
   ```bash
   python -m http.server 8000
   ```
   
   **Com Node.js:**
   ```bash
   npx http-server
   ```
   
   **Com PHP:**
   ```bash
   php -S localhost:8000
   ```

3. **Acesse a aplicação**:
   Abra seu navegador e vá para `http://localhost:8000`

### Estrutura de Arquivos
```
webgis-joao-monlevade/
├── index.html          # Arquivo principal HTML
├── styles.css          # Estilos CSS responsivos
├── script.js           # Funcionalidades JavaScript
├── README.md           # Este arquivo
├── Monlevade.geojson           # Limites municipais
├── Informaçoes Bairros.geojson # Dados dos bairros
├── Estruturas Urbanas.geojson  # Estruturas urbanas
├── Ruas.geojson                # Rede de ruas
└── Nascentes.geojson           # Pontos de nascentes
```

## 🎯 Funcionalidades Detalhadas

### Controle de Camadas
- **Mapas Base**: Alternar entre diferentes tipos de mapa base
- **Camadas de Dados**: Ativar/desativar camadas individuais
- **Estilos Visuais**: Cada camada possui cores e estilos únicos

### Modo Responsivo
- **Desktop**: Sidebar lateral sempre visível
- **Mobile**: Sidebar oculta com botão toggle
- **Adaptação Automática**: Detecta o tamanho da tela automaticamente

### Ferramentas
- **Tela Cheia**: Expandir a aplicação para tela cheia
- **Medição**: Medir distâncias entre pontos no mapa
- **Informações**: Exibir detalhes sobre a aplicação

### Análise Espacial
- **Buffer Analysis**: Criar zonas de influência ao redor de nascentes
- **Raio Configurável**: 100m, 250m, 500m ou 1km
- **Consulta Espacial**: Identificar bairros, estruturas e ruas na área de influência
- **Destaque Visual**: Marcação clara das feições afetadas
- **Resumo Estatístico**: Quantidade de nascentes por bairro e classificação urbana/rural

### Interatividade
- **Popups**: Informações detalhadas ao clicar nos elementos
- **Hover Effects**: Destaque visual ao passar o mouse
- **Navegação**: Zoom, pan e busca de localização

## 🎨 Estilos das Camadas

### Bairros
- **Cor**: Azul (#3498db)
- **Opacidade**: 30% (hover: 60%)
- **Borda**: Azul escuro (#2980b9)

### Estruturas Urbanas
- **Cor**: Vermelho (#e74c3c)
- **Opacidade**: 40% (hover: 70%)
- **Borda**: Vermelho escuro (#c0392b)

### Limites Municipais
- **Cor**: Verde (#27ae60)
- **Opacidade**: 20% (hover: 40%)
- **Borda**: Verde escuro (#229954) com linha tracejada

### Ruas
- **Cor**: Laranja (#f39c12)
- **Espessura**: 2px (hover: 4px)
- **Opacidade**: 80% (hover: 100%)

### Nascentes
- **Cor**: Roxo (#9b59b6)
- **Tipo**: Círculos de 6px (hover: 8px)
- **Opacidade**: 80% (hover: 100%)

## 📱 Compatibilidade

### Navegadores Suportados
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Dispositivos
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🔧 Personalização

### Modificar Cores das Camadas
Edite o arquivo `styles.css` nas seções:
```css
.layer-bairros { /* Cores dos bairros */ }
.layer-estruturas { /* Cores das estruturas */ }
.layer-monlevade { /* Cores dos limites */ }
```

### Adicionar Novas Camadas
1. Adicione o arquivo GeoJSON na pasta
2. Modifique `script.js` na função `loadGeoJSONLayers()`
3. Adicione controles no HTML
4. Defina estilos no CSS

### Alterar Coordenadas Centrais
Modifique a constante no início de `script.js`:
```javascript
const JOAO_MONLEVADE_CENTER = [-19.8127, -43.1735];
```

## 📊 Dados Utilizados

### Fontes dos Dados
- **OpenStreetMap**: Mapa base de ruas
- **Esri**: Imagens de satélite
- **OpenTopoMap**: Mapa topográfico
- **GeoJSON Locais**: Dados específicos de João Monlevade

### Estrutura dos Dados GeoJSON
- **Bairros**: NOME, AREA, POPULACAO
- **Estruturas**: TIPO, NOME, FUNCAO
- **Limites**: Dados administrativos municipais
- **Ruas**: NM_TIP_LOG, NM_LOG, TOT_RES, TOT_GERAL, CD_SETOR, CD_QUADRA
- **Nascentes**: NOME, ALTITUDE, DATA, LATITUDE, LONGITUDE

## 🐛 Solução de Problemas

### Erro de Carregamento de Dados
- Verifique se os arquivos GeoJSON estão na pasta correta
- Certifique-se de que está usando um servidor web local
- Verifique o console do navegador para erros específicos

### Problemas de Responsividade
- Limpe o cache do navegador
- Verifique se o viewport está configurado corretamente
- Teste em diferentes tamanhos de tela

### Performance
- Para arquivos GeoJSON grandes, considere otimizar os dados
- Use compressão gzip no servidor
- Implemente carregamento progressivo se necessário

## 📝 Licença

Este projeto é de uso educacional e demonstrativo. Os dados GeoJSON são específicos para João Monlevade, MG.

## 🤝 Contribuições

Contribuições são bem-vindas! Para contribuir:
1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no repositório
- Consulte a documentação do Leaflet.js
- Verifique os logs do console do navegador

## 🛠️ **Tecnologias Utilizadas**

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Biblioteca de Mapas**: [Leaflet.js](https://leafletjs.com/) v1.9.4
- **Ícones**: [Font Awesome](https://fontawesome.com/) v6.4.0
- **Dados Geoespaciais**: GeoJSON
- **Hospedagem**: GitHub Pages

## 📊 **Dados Incluídos**

- **Nascentes**: 37 pontos de nascentes com dados de altitude e localização
- **Rede Viária**: Sistema completo de ruas e avenidas
- **Bairros**: Divisão administrativa com informações demográficas
- **Estruturas Urbanas**: Infraestrutura e equipamentos urbanos
- **Limites Municipais**: Fronteiras administrativas de João Monlevade

## 🔧 **Desenvolvimento Local**

Para executar o projeto localmente:

```bash
# Clone o repositório
git clone https://github.com/AdrianoJosedeBarros/NascentesJoaoMonlevade.git

# Entre no diretório
cd NascentesJoaoMonlevade

# Inicie um servidor local
python -m http.server 8000
# ou
npx http-server
# ou
php -S localhost:8000

# Acesse http://localhost:8000
```

## 📝 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 **Contribuições**

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 **Contato**

- **Autor**: Adriano José de Barros
- **Projeto**: WebGIS Nascentes João Monlevade
- **GitHub**: [@AdrianoJosedeBarros](https://github.com/AdrianoJosedeBarros)

---

**Desenvolvido com ❤️ para a cidade de João Monlevade - MG**

*Projeto desenvolvido para análise e preservação dos recursos hídricos da região do Vale do Aço.* 