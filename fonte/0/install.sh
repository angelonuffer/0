#!/bin/bash
set -e

if [[ -z "${REF:-}" ]]; then
	echo "A opção ref deve conter um branch, uma tag, um SHA de commit ou semver:<intervalo>." >&2
	exit 1
fi

npm install --global "github:angelonuffer/0#$REF"