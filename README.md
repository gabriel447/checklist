# Checklist

Aplicativo móvel e web construído com Expo e React Native para registrar checklists de instalação/reparo. Permite coletar dados do cliente, localização via Google Maps, fotos (CTO, frente da casa, instalação, MAC), salvar localmente (SQLite no mobile, localStorage no web) e exportar um relatório em PDF.

## Tecnologias

- Expo SDK 54 (`expo@54.0.23`) e EAS Build
- React (`19.1.0`) e React Native (`0.81.5`)
- Web: `react-dom@19.1.0` e `react-native-web@0.21.0`
- Persistência: `expo-sqlite@16.0.9` (nativo) e fallback `localStorage` (web)
- Arquivos: `expo-file-system@19.0.17`
- Imagens: `expo-image-picker@^17.0.8`
- Localização: `expo-location@^19.0.7`
- PDF: `expo-print@~15.0.7`
- Compartilhamento: `expo-sharing@~14.0.7`
- UI: `expo-status-bar` e `react-native-safe-area-context@~5.6.0`
- Ícones: `@expo/vector-icons` (Feather)

Permissões Android: `CAMERA` e `ACCESS_FINE_LOCATION`.

## Como usar

### Pré-requisitos

- Node.js LTS e npm
- Android Studio (para rodar em Android) e/ou Xcode (para iOS)

### Instalação

```bash
npm install
```

### Comandos

- `npm run start` — inicia o servidor de desenvolvimento do Expo (QR code, Metro bundler)
- `npm run android` — inicia no emulador/dispositivo Android (abre Expo Go/DEV Client)
- `npm run ios` — inicia no simulador iOS
- `npm run web` — roda no navegador usando `react-native-web`
- `npm run android:clean` — limpa o cache e inicia no Android
- `npm run ios:clean` — limpa o cache e inicia no iOS
- `npm run web:clean` — limpa o cache e inicia na Web

### Fluxo básico no app

1. Abra o app e edite o nome do usuário (topo da tela).
2. Preencha as seções do checklist:
   - Dados do cliente: nome, rua/número, link de localização
   - CTO/rede externa: link da CTO, cor da fibra, splitter, porta
   - Casa do cliente: link e foto da frente
   - Instalação interna: fotos da instalação e MAC, Wi‑Fi
   - Finalização: testes e satisfação
3. Use os botões para:
   - Puxar localização atual (gera link do Maps)
   - Capturar/selecionar fotos
4. Salve o checklist.
5. Exporte para PDF quando necessário e compartilhe.

### Builds (opcional)

O projeto inclui `eas.json` com perfis de build. Para usar EAS Build:

```bash
eas build --profile preview --platform android
eas build --profile production --platform android
```

Requer instalação do EAS CLI (`npm i -g eas-cli`) e configuração de contas/stores.

## Estrutura

- `App.js` — UI principal e lógica de fluxo
- `index.js` — registro do componente raiz
- `db.native.js` — persistência com SQLite (mobile)
- `db.web.js` — persistência com `localStorage` (web)
- `app.json` — configurações do projeto (ícones, permissões, web)
- `assets/` — ícones e splash

## Observações

- No mobile, fotos podem estar em formatos diversos; a exportação para PDF faz fallback para JPEG quando o tipo não é reconhecido.
- No web, os dados não persistem entre dispositivos; ficam apenas no navegador via `localStorage`.