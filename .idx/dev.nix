{ pkgs, ... }: {
  packages = [
    pkgs.rustc
    pkgs.cargo
    pkgs.gcc
  ];
}