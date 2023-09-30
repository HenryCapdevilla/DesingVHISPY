import git
import time
import json

with open('config.json', 'r') as config_file:
    config = json.load(config_file)

repo_path = '/SPsy'  # Ruta de tu repositorio local
rama_remota = config["database"]["rama"]  # Nombre de la rama remota que deseas verificar

while True:
    try:
        repo = git.Repo(repo_path)
        origin = repo.remotes.origin

        # Obtiene el commit más reciente en la rama remota
        origin.fetch()
        rama_remota_ref = f'{rama_remota}'
        latest_commit = origin.refs[rama_remota_ref].commit

        # Compara el commit actual con el commit más reciente en la rama remota
        if repo.head.commit != latest_commit:
            print(f"Actualizando el repositorio desde la rama '{rama_remota}'...")
            repo.remotes.origin.pull(rama_remota_ref)
            print("Repositorio actualizado.")
        else:
            print("No hay cambios en la rama remota.")

    except Exception as e:
        print("Error:", str(e))

    # Espera un minuto antes de verificar de nuevo (puedes ajustar el intervalo)
    time.sleep(60)