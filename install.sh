#!/bin/sh

# Cores para a saída
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # Sem cor

# Nomes e URLs
CMD_NAME="0"
INTERPRETER_NAME="0_node.js"
REPO_USER="Nuffem"
REPO_NAME="0"
INTERPRETER_URL="https://cdn.jsdelivr.net/gh/$REPO_USER/$REPO_NAME@main/$INTERPRETER_NAME"

# Diretórios de instalação
BIN_DIR="$HOME/.local/bin"
LIB_DIR="$HOME/.local/lib/zero-lang"
CMD_PATH="$BIN_DIR/$CMD_NAME"
INTERPRETER_PATH="$LIB_DIR/$INTERPRETER_NAME"


echo "Instalando a Linguagem 0..."

# 1. Cria os diretórios de instalação se não existirem
echo "Verificando os diretórios de instalação..."
mkdir -p "$BIN_DIR"
mkdir -p "$LIB_DIR"

# 2. Baixa o interpretador
echo "Baixando o interpretador de '$INTERPRETER_URL'..."
if command -v curl >/dev/null 2>&1; then
    curl -sSL "$INTERPRETER_URL" -o "$INTERPRETER_PATH"
elif command -v wget >/dev/null 2>&1; then
    wget -qO "$INTERPRETER_PATH" "$INTERPRETER_URL"
else
    echo "${YELLOW}Erro: Você precisa ter 'curl' ou 'wget' instalado para baixar o interpretador.${NC}"
    exit 1
fi

if [ ! -s "$INTERPRETER_PATH" ]; then
    echo "${YELLOW}Erro: Falha ao baixar o interpretador. O arquivo está vazio ou o download falhou.${NC}"
    exit 1
fi

echo "${GREEN}Interpretador baixado com sucesso para '$INTERPRETER_PATH'.${NC}"

# 3. Cria o script de wrapper para o comando '0'
echo "Criando o comando '$CMD_NAME' em '$CMD_PATH'"
cat > "$CMD_PATH" << EOL
#!/bin/sh
# Wrapper para o interpretador da Linguagem 0
exec node "$INTERPRETER_PATH" "\$@"
EOL

# 4. Torna o comando executável
chmod +x "$CMD_PATH"

echo "${GREEN}Comando '$CMD_NAME' criado com sucesso.${NC}"

# 5. Verifica se o diretório de instalação está no PATH
if ! echo "$PATH" | grep -q "$BIN_DIR"; then
    echo "\n${YELLOW}Atenção: O diretório '$BIN_DIR' não está no seu PATH.${NC}"
    echo "Para usar o comando '0' de qualquer lugar, adicione a seguinte linha ao seu arquivo de configuração do shell (ex: ~/.bashrc, ~/.zshrc):"
    echo "\n  export PATH=\"\$HOME/.local/bin:\$PATH\"\n"
    echo "Depois, reinicie seu shell ou execute 'source ~/.bashrc' (ou o arquivo correspondente)."
else
    echo "\nO diretório '$BIN_DIR' já está no seu PATH."
fi

echo "\n${GREEN}Instalação da Linguagem 0 concluída!${NC}"
echo "Use o comando '0 seu_arquivo.0' para executar seus programas."
