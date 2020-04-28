fe := frontend/ngxinger
node_modules := $(fe)/node_modules
node_modules_touch := $(node_modules)/.npm_ci
frontend_dist := $(fe)/dist/ngxinger
index_html := $(frontend_dist)/index.html
frontend_clean := $(fe)_clean

$(node_modules_touch): $(fe)/package-lock.json
	cd $(fe); npm ci
	touch $(node_modules_touch)

$(index_html): $(node_modules_touch)
	cd $(fe); ng build --prod

.PHONY: $(frontend_clean)
$(frontend_clean):
	rm -rf $(frontend_dist)

.PHONY: frontend_test
frontend_test: $(node_modules_touch)
	cd $(fe); ng test --watch=false

.PHONY: frontend_lint
frontend_lint: $(node_modules_touch)
	cd $(fe); ng lint

