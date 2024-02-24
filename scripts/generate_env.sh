#!/usr/bin/env bash

## Este script genera el archivo .env

## Parámetros tomados desde el entorno:
## CAPTCHA_SITE_KEY
## CAPTCHA_SITE_PRIVATE_KEY
## APP_NAME
## APP_DOMAIN
## APP_URL
## APP_DESCRIPTION
## APP_LOCALE
## APP_LOCALE_ALTERNATE
## API_BASE_URL
## API_PATH_CONTACT

################ Creo variables de trabajo ################

WORKSCRIPT="$(pwd)"

################ Comprueba requisitos ################

## En caso de ser root se aborta.
if [[ $(whoami) = 'root' ]]; then
    echo 'No puedes ejecutar este script como root'
    exit 1
fi

## En caso de no encontrar archivos esenciales para la ejcución se aborta.
if [[ ! -f "${WORKSCRIPT}/env.example.production" ]] ||
   [[ ! -d "${WORKSCRIPT}/scripts" ]] ||
   [[ ! -f "${WORKSCRIPT}/scripts/functions.sh" ]]; then
    echo 'Este script solo puede ser ejecutado desde la raíz del proyecto.'
    exit 1
fi

## En caso de existir un archivo .env se omiten operaciones.
if [[ -f "${WORKSCRIPT}/.env" ]]; then
    echo 'Ya existe un archivo .env en el proyecto, omitiendo operaciones.'
    exit 0
fi

################ Incluyo archivos de funciones ################

source "${WORKSCRIPT}/scripts/functions.sh"

################ Comienza el flujo de generar .env ################

## Creo el archivo .env a partir del archivo con parámetros predefinidos.
cp "${WORKSCRIPT}/env.example.production" "${WORKSCRIPT}/.env"

## General
replace_or_add_var_in_file "${WORKSCRIPT}/.env" 'APP_NAME' "${APP_NAME}"
replace_or_add_var_in_file "${WORKSCRIPT}/.env" 'APP_DOMAIN' "${APP_DOMAIN}"
replace_or_add_var_in_file "${WORKSCRIPT}/.env" 'APP_URL' "${APP_URL}"
replace_or_add_var_in_file "${WORKSCRIPT}/.env" 'APP_DESCRIPTION' "${APP_DESCRIPTION}"
replace_or_add_var_in_file "${WORKSCRIPT}/.env" 'APP_LOCALE' "${APP_LOCALE}"
replace_or_add_var_in_file "${WORKSCRIPT}/.env" 'APP_LOCALE_ALTERNATE' "${APP_LOCALE_ALTERNATE}"
replace_or_add_var_in_file "${WORKSCRIPT}/.env" 'API_DOMAIN_URL' "${API_DOMAIN_URL}"
replace_or_add_var_in_file "${WORKSCRIPT}/.env" 'API_BASE_URL' "${API_BASE_URL}"
replace_or_add_var_in_file "${WORKSCRIPT}/.env" 'API_PATH_CONTACT' "${API_PATH_CONTACT}"

## Google Captcha
replace_or_add_var_in_file "${WORKSCRIPT}/.env" 'CAPTCHA_SITE_KEY' "${CAPTCHA_SITE_KEY}"
replace_or_add_var_in_file "${WORKSCRIPT}/.env" 'CAPTCHA_SITE_PRIVATE_KEY' "${CAPTCHA_SITE_PRIVATE_KEY}"
