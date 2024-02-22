---
layout: page
title: Projects
permalink: /projects/
---

<div class="project">

## BPCells: High-performance single cell analysis
[<img src="https://benparks.net/BPCells-screenshot.png" class="project" />](https://bnprks.github.io/BPCells/)

BPCells is a package for high performance single cell analysis on RNA-seq and ATAC-seq datasets. It can analyze a 1.3M cell dataset with 2GB of RAM in around 10 minutes. BPCells
achieves this low memory usage by performing all calculations in a disk-backed manner, and 
relies on an optimzed C++ backend and efficient storage formats to maintain speed comparable
to fully in-memory analysis. Installed over 10k times, and averaging ~1k installs per month.

<br/>

([docs](https://bnprks.github.io/BPCells/)) ([code](https://github.com/bnprks/BPCells))
</div>


<div class="project">

## highway-sleef: Cross-platform SIMD math functions in C++
[<img src="/highway-sleef-screenshot.png" class="project" />](https://github.com/bnprks/highway-sleef/)

Semi-automated translation of [SLEEF](https://sleef.org/) vector math library to use [highway](https://github.com/google/highway) cross-platform compatibility layer. Includes over 50 f32 and f64 math functions spanning trigonometry, exponentials, and probability (nearly all of `math.h` plus some extras). Enables easier integration of SLEEF into `C++` projects and utilization of Highway's runtime feature detection to allow single-binary distributions.


Uses [tree-sitter](https://tree-sitter.github.io/tree-sitter/) for robust parsing and a custom python translation code for outputting `C++`. 

<br/>

([code](https://github.com/bnprks/highway-sleef/))
</div>

<div class="project">

## McFly-fzf: CLI history search
[<img src="/mcfly-fzf-screenshot.png" class="project" />](https://github.com/bnprks/mcfly-fzf/)

Rust-based CLI tool to integrate [McFly](https://github.com/cantino/mcfly) with [fzf](https://github.com/junegunn/fzf). Queries the McFly command history database to power an interactive fzf frontend, with options to filter history search by exit status and directory. Includes configuration scripts for bash, zsh, and fish shells.

<br/>

([releases](https://github.com/bnprks/mcfly-fzf/releases)) ([code](https://github.com/bnprks/mcfly-fzf/))
</div>


<div class="project">

## College Directory Search
[<img src="/search-screenshot.png" class="project" />](/search/)



I wrote this as a faster version of Princeton's internal student directory. It downloads all the student data to the client so that searches can be executed instantly as the user types. The site with current data is available [here](http://princetonfacebook.com) with a Princeton student login, but the public demo uses fake generated data.

<br/>

([demo](/search/)) ([code](https://github.com/bnprks/people-search))
</div>


<div class="project">

## Flood It Game
[<img src="/flood-it-screenshot.png" class="project" />](/flood-it)

This was my first clojurescript project. It is a remake of a simple puzzle game called
Flood It built using re-frame/reagent.

<br/>

([demo](/flood-it/)) ([code](https://github.com/bnprks/flood-it))
</div>