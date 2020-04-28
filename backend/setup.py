from setuptools import setup, find_packages
import os


def package_files(directory):
    paths = []
    for (path, directories, filenames) in os.walk(directory):
        for filename in filenames:
            paths.append(os.path.join("..", path, filename))
    return paths


setup(
    name="ngxinger",
    version="1.0.0",
    packages=["ngxinger"],
    package_data={"ngxinger": package_files("ngxinger/static"),},
    platforms="any",
    install_requires=["Flask==1.1.2", "gunicorn==20.0.4", "pyproj==2.6.0"],
)
