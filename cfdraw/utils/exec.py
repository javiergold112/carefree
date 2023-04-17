import os
import uvicorn
import subprocess

from cftool.misc import print_info

from cfdraw import constants
from cfdraw.utils import console
from cfdraw.utils import prerequisites
from cfdraw.config import get_config


def setup_frontend() -> None:
    config = get_config()
    fe_port = config.frontend_port
    be_port = config.backend_port
    prerequisites.install_frontend_packages()
    console.rule("[bold green]Launching App")
    os.environ["CFDRAW_FE_PORT"] = fe_port
    os.environ["CFDRAW_BE_PORT"] = be_port


def run_frontend() -> None:
    setup_frontend()
    subprocess.Popen(
        [prerequisites.get_yarn(), "dev", "--force"],
        cwd=constants.WEB_ROOT,
        env=os.environ,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.STDOUT,
    )
    frontend_url = f"http://localhost:{get_config().frontend_port}"
    print_info(f"👌 Your app will be ready at {frontend_url} soon...")


def run_frontend_prod() -> None:
    setup_frontend()
    subprocess.Popen(
        [prerequisites.get_yarn(), "build:preview", "--host"],
        cwd=constants.WEB_ROOT,
        env=os.environ,
    )
    print_info(
        f"👀 Your app codes are being compiled, "
        "please wait until a bunch of urls appear..."
    )


def run_backend(
    module: str,
    *,
    log_level: constants.LogLevel = constants.LogLevel.DEBUG,
) -> None:
    config = get_config()
    console.rule("[bold green]Launching Backend")
    # I'm not familiar with production stuffs of `uvicorn`, so currently
    # only the `reload` flag is different.
    uvicorn.run(
        f"{module}:{config.entry}.{constants.API_VAR}",
        host=constants.DEV_BACKEND_HOST,
        port=int(config.backend_port),
        log_level=log_level,
        reload=not config.prod,
    )
