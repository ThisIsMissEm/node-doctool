GJSLINT = gjslint --unix_mode --strict --nojsdoc

test:
	@expresso -s test/*.test.js

lint:
	@$(GJSLINT) -r lib/ -r test/

.PHONY: test lint