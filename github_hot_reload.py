import git
import time

repo_path = 'C:/Users/Henry D/OneDrive/Escritorio/Diseno02/DSP2/DesingVHISPY'  # Ruta de tu repositorio local

repo = git.Repo(repo_path)

while True:
    try:
        # Obtiene el commit más reciente en la rama principal "main"
        repo.remotes.origin.fetch()
        latest_commit = repo.remotes.origin.refs['main'].commit

        # Compara el commit actual en la rama principal "main" con el commit más reciente
        if repo.heads.main.commit != latest_commit:
            print("Actualizando el repositorio en la rama principal 'main'...")
            repo.remotes.origin.pull('main')
            print("Repositorio actualizado en la rama principal 'main'.")
        else:
            print("No hay cambios en la rama principal 'main'.")

    except Exception as e:
        print("Error:", str(e))

    # Espera un minuto antes de verificar de nuevo (puedes ajustar el intervalo)
    time.sleep(60)
