
make: backend/ngxinger.pex

include frontend/Makefile
include backend/Makefile

.PHONY: clean
clean: $(backend_clean) $(frontend_clean)

.PHONY: test
test: backend_test frontend_test

.PHONY: lint
lint: backend_lint frontend_lint

