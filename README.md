# apwebsite

### Run

Universal: yarn start
SSG: yarn export

### Prepare
* installs extensions: eslint, es7+ React/Redux..., Sass/Less/Stylus/Pug..., Stylelint, TODO highlight.
* installs: npm install husky --save-dev ------(not)npx husky-init && yarn

### Libraries & Framework
* nextJS v12: https://nextjs.org/docs/getting-started
* react v17: https://reactjs.org/docs/getting-started.html
* axios v0.26: https://github.com/axios/axios
* emotion v11: https://emotion.sh/docs/introduction
* scss v1: https://sass-lang.com/guide
* redux toolkit: https://redux-toolkit.js.org/introduction/getting-started
* react testing: https://testing-library.com/docs 
* date-time v2.28: https://date-fns.org/
* palettes: https://material.io/design/color/the-color-system.html#tools-for-picking-colors

### Folder structure
* components: Atomic design (pages, templates, organisms, molecules, atoms ) https://www.linkedin.com/pulse/atomic-design-pattern-shubham-hirap
* pages: https://nextjs.org/docs/basic-features/pages
* stores: includes: side effect, state management, context page...
* styles: Ui style GLOBAL, SCSS follow architecture https://www.learnhowtoprogram.com/user-interfaces/building-layouts-preprocessors/7-1-sass-architecture
* types: interface, abstract, class...
* utils: includes: formatter, transform api, normalize data, constants.

### Git flow (Branch name)
* main: prev-ver production
* prod: production -- https://aplushome.vn/
* stg: staging -- https://stg.aplus.app/
* test: pre-staging -- https://test.aplushome.vn/
* dev: web-test -- https://webtest.aplus.app/

* Exception: hotfixes: checkout from main/prod

# Flow Pending: 
              dev -> test -> stg -> prod -> main
    feature <- |       |      |              | -> backup prev prod
    fix                |      | -> hotfix
    refactor           |-> ready release
    docs
    ...

=> End-print Final code: Create version Tag to go Prod 
=> Note: The pipeline will just trigger with above Flow.

**Prefix**

* feature: add feature
* fix: fixbug from dev
* hotfix: fixbug from production env
* refactor: refactor, don't feature
* docs: add/edit documents
* chore: change/edit issues aren't affect code
* style: change/refactor/edit style scss, css, UI...
* perf: enhance/improve performance
* vender: upgrade version dependencies, packages...
* conflict: fix conflict

Branch name: [prefix]/[code]-[title]
Ex: feature/JIRA-001-create-branch

Commit: (hotfix|fix|feature|refactor|docs|chore|style|perf|vender|conflict): < comment >
Ex: feature: JIRA-01 testing