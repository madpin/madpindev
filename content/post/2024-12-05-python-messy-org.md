---
layout:     post 
showtoc: true
title:      "Taming the Python Beast: A Practical Guide to Script Organization"
subtitle:   "From Jungle to Garden: Simple Tricks for Managing Python Projects Without the Complexity"
date:       2024-12-05
author:     "Thiago MadPin"
URL:        "/2024/12/05/python-messy-org/"
image:      "/img/posts/2024-12-05-python-messy-org.png"
tags:
    - Python
categories: [ Tech ]
---


Ever feel like your Python projects resemble a tangled mess of vines and overgrown foliage, a digital Amazon rainforest where scripts roam wild and free? Yeah, me too.  Especially when you've got a bunch of standalone scripts that also need to call each other – it's like trying to herd cats riding unicycles.  But fear not, fellow explorers! I've stumbled upon a simple way to bring some order to the chaos without resorting to building full-blown libraries or complex structures.

This isn't about perfect, pristine organization.  Think of it as "half-organizing"—just enough to keep things from turning into a complete disaster.  It's like tidying up your desk so you can *actually find* your coffee mug, but not stressing about colour-coding your sticky notes.

The magic ingredient?  The `python -m` command.  It's not just for running modules; it's your secret weapon for sane imports across your script jungle.

### The `-m`agic Trick

So, what's the big deal with `python -m`? Well, it lets you run your scripts as modules directly from the root folder. This means that imports between your scripts will work as expected, following the directory structure. No more fiddling with `sys.path` or weird relative imports!

Imagine your project looks like this:

```
my_project/
├── tech/
│   └── mongo/
│       └── simple_advid.py
└── utils/
    └── helper.py
```

Now, if `simple_advid.py` needs to import something from `helper.py`, you can simply do:

```python
# inside simple_advid.py
from utils.helper import some_function

# ... rest of your code
```

And when you run `simple_advid.py` from the root folder using `python -m tech.mongo.simple_advid`, the import will work seamlessly! It's like giving your scripts a shared map of the jungle so they can find each other.

### Debugging in VS Code: Like a Microscope for Your Code

Now, what about debugging? We all know how crucial that is. I've been using a handy VS Code extension called "Command Variable" that lets you debug your scripts as modules.  It's like having a powerful microscope to examine your code's inner workings.

Here's the snippet for your `launch.json`:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Python Debugger: Module",
            "type": "debugpy",
            "request": "launch",
            "module": "${command:extension.commandvariable.file.relativeFileDotsNoExtension}",
            "console": "integratedTerminal",
            "justMyCode": true
        },
    ]
}
```

With this setup, you can debug the currently open file as a module, just like you're running it from the command line.  No more print statements scattered throughout your code like breadcrumbs!

### Why This Matters (Especially for Us ADHD Folks)

For those of us navigating the challenges of ADHD (like myself!), this kind of streamlined organization can be a game-changer. It reduces cognitive overhead, making it easier to focus on the actual coding and problem-solving. It's like having a designated bike lane for your thoughts, keeping them from veering off into the weeds.

So, there you have it! A simple, practical approach to taming your Python script jungle. It's not about achieving perfect order, but about finding a balance that works for you.  Now go forth, and may your code be ever in your favor!
