be := backend
flask_app_root := $(be)/ngxinger
flask_static := $(flask_app_root)/static
flask_index_html := $(flask_static)/index.html
backend_clean := $(be)_clean
backend_venv := $(be)/venv
backend_venv_activate := $(backend_venv)/bin/activate
requirements_txt_dev := $(be)/requirements.txt
pex := $(be)/ngxinger.pex


$(flask_index_html): $(index_html)
	cp -rl $(frontend_dist)/* $(flask_static)

$(pex): $(flask_index_html)
	cd $(be); venv/bin/pex . -o ../$(pex) -c gunicorn

.PHONY: $(backend_clean)
$(backend_clean):
	rm -rf $(flask_static)/*

$(backend_venv_activate):
	python3 -m virtualenv $(backend_venv)
	$(backend_venv)/bin/pip install -r $(requirements_txt_dev)

.PHONY: backend_test
backend_test: $(backend_venv_activate)
	cd $(be); venv/bin/pytest

.PHONY: backend_lint
backend_lint: $(backend_venv_activate)
	$(backend_venv)/bin/black --check $(be)/*.py $(be)/ngxinger/*.py $(be)/tests/*.py

