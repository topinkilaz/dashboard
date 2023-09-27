
set -o errexit

pip install -r requerimets.txt 

python manage.py collectstatic --no-input