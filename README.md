# Django and React Tutorial

## Introduction

Welcome to this Django and React tutorial. In this tutorial, I am **not** going to be teaching you how to use React, or how to use Django. I will be teaching you how to integrate React into your Django application.

## Prerequisites

- Python
- Node.js
- Npm
- A computer
- Basic Python knowledge
- Basic Django knowledge
- Intermediate JavaScript knowledge
- Basic React knowledge

## Tutorial

### Setting up a Django Application

Create a new Python repl and open the Shell. If you're using an existing Django project, just add the `frontend` app.

```bash
pip install django
django-admin startproject django_react . # This dot will the project in the main directory instead of wrapping it in a new folder.
django-admin startapp frontend
```

![Commands](createApp.gif)

### Running your Django Application

Now, you can delete the `main.py` file. Create a new file called `.replit` with the following contents:

```toml
language="python3"
run="python manage.py runserver 0.0.0.0:3000"
```

If you are doing this on your computer, you can just run the server from your Terminal.

Now, your files should look like this:

```
|____manage.py
|____django_react
| |______init__.py
| |____asgi.py
| |____settings.py
| |____urls.py
| |____wsgi.py
|____frontend
| |______init__.py
| |____admin.py
| |____apps.py
| |____models.py
| |____tests.py
| |____views.py
| |____migrations
| | |______init__.py
|____.replit
```

Go into your `settings.py` file, and set `ALLOWED_HOSTS` to `['*']`

If you run your repl, you'll see that the server starts running. *For some reason, the embedded version of the website doesn't work, so you'll have to open it in a new tab.*

### Setting up our `frontend` app

Now, if you go to `settings.py`, you'll need to add `frontend` to `INSTALLED_APPS`.

Go into your shell/terminal again.
Run the following commands to set up react, and the other modules.

```bash
python manage.py makemigrations
python manage.py migrate
cd frontend
mkdir templates
mkdir templates/frontend
mkdir static
mkdir static/frontend
mkdir static/css
mkdir static/images
mkdir src
mkdir src/components
npm init -y
npm i webpack webpack-cli --save-dev
npm i @babel/core babel-loader @babel/preset-env @babel/preset-react --save-dev
npm i react react-dom --save-dev
npm install @material-ui/core
npm install @babel/plugin-proposal-class-properties
npm install react-router-dom
```

That was a lot of commands. The first 2 commands apply migrations to your Django database. The next 9 commands navigate to the `frontend` directory, and create the necessary folders. The next 7 commands init a npm project and install the modules we need.

Create a file called `babel.config.json`, with the following contents:

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "10"
        }
      }
    ],
    "@babel/preset-react"
  ],
  "plugins": ["@babel/plugin-proposal-class-properties"]
}
```

Babel enables backwards-compatibility for older versions of JavaScript on browsers. This will mean that more devices and web browsers can run your website.

Now, create `webpack.config.js` with this code:

```js
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./static/frontend"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
  ],
};
```

This code "bundles" your code into a single JavaScript file that will be loaded by your Django template. The JavaScript is also optimized to make it load faster, and make the file smaller

Now, inside `package.json`, we need to add two scripts.

```json
{
...
"scripts": {
    "dev": "webpack --mode development --watch --stats-error-details",
    "build": "webpack --mode production"
}
...
}
```

We can now edit our `.replit` file to build our JavaScript when we run the repl.

```toml
language="python3"
run="cd frontend && npm run build && cd .. && python manage.py runserver 0.0.0.0:3000"
```

This may look a little confusing, but it is just telling Replit to go to the `frontend` folder, to build our scripts, navigate out of the `frontend` folder, and run the server.

Now, let's create a file called `index.js` inside of the `src` folder. ***Do not make it inside of the `components` folder!***

```js
import App from "./components/App";
```

This file will be used by webpack to bundle the JavaScript.

Now, go to `templates/frontend` and create an `index.html` file like this:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Django-React Demo</title>
    {% load static %}
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
    />
    <link rel="stylesheet" type="text/css" href="{% static "css/index.css" %}"
    />
  </head>
  <body>
    <div id="main">
      <div id="app"></div>
    </div>

    <script src="{% static "frontend/main.js" %}"></script>
  </body>
</html>
```

This will be used to render the JavaScript/React code we're going to write. We're loading our CSS and JavaScript here. The `div`s will be where we render our JavaScript/React code.

Now, it's time to write some Python code!

We're going to create a view that will render our template.
Go to `views.py` and add this view:

```python
from django.shortcuts import render

# Create your views here.
def index(request, *args, **kwargs):
    return render(request, 'frontend/index.html')
```

This is going to render the template `index.html`. We won't need any other views.

Go to `django_react/urls.py` and add a route:

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin', admin.site.urls),
    path('', include('frontend.urls'))
]
```

This will let us access our urls in the `frontend/urls.py` file. However, that file doesn't exist. Let's create it1

```python
from django.urls import path
from .views import index

urlpatterns = [
    path('', index)
]
```

For every route you create, you need to pass the `index` view. This will just render the template for the view. It'll be the same view every time, but our JavaScript will have its own router for the different pages.

Finally, let's create a file called `index.css` inside our `static/css` folder.

```css
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#main {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}

#app {
  width: 100%;
  height: 100%;
}

.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

```

### Writing React Code

That was a long setup, but we're ready to start React-ing

Create a file in the `src/components` folder called `App.js` with the following code:

```js
import React, { Component } from "react";
import { render } from "react-dom";
import Routes from "./Routes";

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <Routes />;
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
```

Now, this code is returning the code inside `Routes.py` which we'll create in a moment. It also renders everything into the `div` we created inside the `index.html` file.

Now, let's create `Routes.py` inside the `components` folder. This file will control the routes for the different pages on your website and render the content onto them.

```js
import React, { Component } from "react";
import HomePage from "./HomePage";
import OtherPage from "./OtherPage";
import AnotherPage from "./AnotherPage";
import { BrowserRouter, Switch, Route, Link, Redirect } from "react-router-dom";

export default class Routes extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={HomePage}>
            <HomePage />
          </Route>
          <Route exact path="/1" component={OtherPage}>
            <OtherPage />
          </Route>
          <Route exact path="/2" component={AnotherPage}>
            <AnotherPage />
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
} // You must also add these routes to urls.py
```

As you can see, you can use `<BrowserRouter>` from the `react-router-dom` module to create a router for your app. You then use `<Router>` to define your routes. You can then use `<YourReactComponent />` to render that component on the specified path.

I've now created three new components. `HomePage.js`, `OtherPage.js` and `AnotherPage.js`. These are very basic React pages that will be rendered by the paths above.

However, you can create your own React components now for your Django application.
You could even have another Django app for the backend of your website, and use React on the frontend app to make it look nice.

Here is an example of a basic React component. You could modify this to create your own website, our just create your own component!

`HomePage.js`

```js
import React, { Component } from 'react';

export default class HomePage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div><h1>Home page</h1><p>This is the home page</p></div>)
    }
}
```

Here are my three pages:
1. https://djangoreactdemo.dillonb07.repl.co/
2. https://djangoreactdemo.dillonb07.repl.co/1
3. https://djangoreactdemo.dillonb07.repl.co/2


And my repl is at the bottom of this tutorial.

If you have any questions, suggestions or feedback, then put them in the comments below!