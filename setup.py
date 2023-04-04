from setuptools import setup, find_packages

VERSION = "0.1.0"
PACKAGE_NAME = "carefree-drawboard"

DESCRIPTION = "An AI-powered drawboard for everyone."
with open("README.md", encoding="utf-8") as f:
    LONG_DESCRIPTION = f.read()

setup(
    name=PACKAGE_NAME,
    version=VERSION,
    packages=find_packages(exclude=("tests",)),
    include_package_data=True,
    install_requires=["pynecone", "carefree-creator>=0.2.0"],
    author="carefree0910",
    author_email="syameimaru.saki@gmail.com",
    description=DESCRIPTION,
    long_description=LONG_DESCRIPTION,
    long_description_content_type="text/markdown",
    keywords="python carefree-learn drawboard",
)
