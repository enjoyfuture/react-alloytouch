# React AlloyTouch

This is a react component for AlloyTouch.

## Install

```
npm install react-alloyTouch --save
```

## Example

```
npm install
gulp example
```

http://localhost:9090


## Online Example

http://reactjs-ui.github.io/react-alloyTouch/

## Build Example
第一次需要先执行前两步操作，再执行第三步。以后修改例子后，只需要执行第三步即可

* 创建 gh-pages 分支，**在执行 git subtree add 命令之前，需确保 gh-pages 分支下至少存在一个文件**
```
git checkout -b gh-pages
rm -rf *     //隐藏文件需要单独删除，结合命令 ls -a
git add -A
vim .gitignore //输入一些内容
git add README.md
git commit -m "init branch gh-pages"
git push --set-upstream origin gh-pages
git push
git checkout master
```

* 把分支 gh-pages 添加到本地 subtree 中，执行该命令前，请确保 examples-dist 文件夹不存在

```
git subtree add --prefix=examples-dist origin gh-pages --squash
```
  
* 生成在线 examples
```
gulp example:build
git add -A examples-dist
git commit -m "Update online examples"
git subtree push --prefix=examples-dist origin gh-pages --squash
git push
```

## Usage

```javascript

```

## Options

| 选项        | 类型   |  功能  |
| --------   | ----- | ---- |
| className | PropTypes.string| 自定义 className|

## Build

```
gulp build
```

## Publish

```
npm publish
```

## Issue

https://github.com/reactjs-ui/react-alloyTouch/issues

## Version

Please view [here](./CHANGELOG.md)
