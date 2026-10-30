# GEM MSA Mobile

Aplicativo Android instalável para montar atividades do MSA e imprimir ou salvar as provas em PDF.

## Estrutura

- `app/`: aplicativo Android nativo que exibe o montador em um WebView.
- `web/`: interface, banco de exercícios, estilos e figuras incluídos no aplicativo.
- `gradle/`, `gradlew.bat`: wrapper para compilar o projeto.

O projeto é independente do repositório web original. A tarefa `syncWebAssets` copia `web/` para os recursos do aplicativo durante o build.

## Compilar no Windows

Requisitos: JDK 17 ou superior e Android SDK 35.

```powershell
.\gradlew.bat assembleDebug
```

O APK será gerado em `app/build/outputs/apk/debug/app-debug.apk`.

## Conteúdo e direitos

O banco de exercícios e algumas figuras são provenientes do material MSA. Antes de publicar este repositório ou redistribuir o APK, confirme que você possui autorização para publicar esse conteúdo.
