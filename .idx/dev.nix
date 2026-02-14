{ pkgs, ... }: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_22
  ];
  idx = {
    extensions = [
      "google.gemini-cli-vscode-ide-companion"
    ];
  };
}