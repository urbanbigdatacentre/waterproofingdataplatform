# WPD-Docs \[WIP\]

This documentation is created using [read-the-docs](https://readthedocs.org/) services, [sphinx](https://www.sphinx-doc.org/en/master/index.html) compiler and [reStructuredText](https://docutils.sourceforge.io/rst.html) markup language.


## Usage

### Setup
First, you need to install `sphinx` compiler and the documentation theme to your local machine, preferably using python package manager:

```bash
$ pip3 install sphinx sphinx_rtd_theme
```


### Compiling

To compile the docs locally, just run:

```bash
$ make html
```

while in root path. Then, open `WPD-Docs/_build/html/index.html` in any browser.

### Publishing

To publish any changes in the documentation to the website, just commit and push to remote. Your change will be processed and updated in minutes.