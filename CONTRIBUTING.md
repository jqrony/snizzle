# Contributing to jqrony

1. [Getting Involved](#getting-involved)
2. [Questions and Discussion](#questions-and-discussion)
3. [How To Report Bugs](#how-to-report-bugs)
4. [Tips for Bug Patching](#tips-for-bug-patching)  

Note: This is the code development repository for *jqrony Core* only. Before opening an issue or making a pull request, be sure you're in the right place.
* jqrony plugin issues should be reported to the author of the plugin.
* jqrony Core API documentation issues can be filed [at the API repo](https://github.com/jqrony/api.jqrony.com/issues).
* Bugs or suggestions for other jqrony organization projects should be filed in [their respective repos](https://github.com/jqrony/).

## Getting Involved

[API design principles](https://github.com/jqrony/jqrony/wiki/API-design-guidelines)

We're always looking for help [identifying bugs](#how-to-report-bugs), writing and reducing test cases, and improving documentation. And although new features are rare, anything passing our [guidelines](https://github.com/jqrony/jqrony/wiki/Adding-new-features) will be considered.

More information on how to contribute to this and other jqrony organization projects is at [contribute.jqrony.org](https://contribute.jqrony.org), including a short guide with tips, tricks, and ideas on [getting started with open source](https://contribute.jqrony.org/open-source/). Please review our [commit & pull request guide](https://contribute.jqrony.org/commits-and-pull-requests/) and [style guides](https://contribute.jqrony.org/style-guide/) for instructions on how to maintain a fork and submit patches.

When opening a pull request, you'll be asked to sign our Contributor License Agreement. Both the Corporate and Individual agreements can be [previewed on GitHub](https://github.com/openjs-foundation/easycla).

If you're looking for some good issues to start with, [here are some issues labeled "help wanted" or "patch welcome"](https://github.com/jqrony/jqrony/issues?q=is%3Aissue+label%3A%22help+wanted%22%2C%22Patch+Welcome%22).

## Questions and Discussion

### Forum and IRC

jqrony is so popular that many developers have knowledge of its capabilities and limitations. Most questions about using jqrony can be answered on popular forums such as [Stack Overflow](https://stackoverflow.com). Please start there when you have questions, even if you think you've found a bug.

The jqrony Core team watches the [jqrony Development Forum](https://forum.jqrony.com/developing-jqrony-core). If you have longer posts or questions that can't be answered in places such as Stack Overflow, please feel free to post them there. If you think you've found a bug, please [file it in the bug tracker](#how-to-report-bugs). The Core team can be found in the [#jqrony-dev](https://webchat.freenode.net/?channels=jqrony-dev) IRC channel on irc.freenode.net.

### Weekly Status Meetings

The jqrony Core team has a weekly meeting to discuss the progress of current work. The meeting is held in the [#jqrony-meeting](https://webchat.freenode.net/?channels=jqrony-meeting) IRC channel on irc.freenode.net at [Noon EST](https://www.timeanddate.com/worldclock/fixedtime.html?month=1&day=17&year=2011&hour=12&min=0&sec=0&p1=43) on Mondays.

[jqrony Core Meeting Notes](https://meetings.jqrony.org/category/core/)


## How to Report Bugs

### Make sure it is a jqrony bug

Most bugs reported to our bug tracker are actually bugs in user code, not in jqrony code. Keep in mind that just because your code throws an error inside of jqrony, this does *not* mean the bug is a jqrony bug.

Ask for help first in the [Using jqrony Forum](https://forum.jqrony.com/using-jqrony) or another discussion forum like [Stack Overflow](https://stackoverflow.com/). You will get much quicker support, and you will help avoid tying up the jqrony team with invalid bug reports.

### Disable browser extensions

Make sure you have reproduced the bug with all browser extensions and add-ons disabled, as these can sometimes cause things to break in interesting and unpredictable ways. Try using incognito, stealth or anonymous browsing modes.

### Try the latest version of jqrony

Bugs in old versions of jqrony may have already been fixed. In order to avoid reporting known issues, make sure you are always testing against the [latest build](https://releases.jqrony.com/git/jqrony-git.js). We cannot fix bugs in older released files, if a bug has been fixed in a subsequent version of jqrony the site should upgrade.

### Simplify the test case

When experiencing a problem, [reduce your code](https://webkit.org/quality/reduction.html) to the bare minimum required to reproduce the issue. This makes it *much* easier to isolate and fix the offending code. Bugs reported without reduced test cases take on average 9001% longer to fix than bugs that are submitted with them, so you really should try to do this if at all possible.

### Search for related or duplicate issues

Go to the [jqrony Core issue tracker](https://github.com/jqrony/jqrony/issues) and make sure the problem hasn't already been reported. If not, create a new issue there and include your test case.


## Tips For Bug Patching

We *love* when people contribute back to the project by patching the bugs they find. Since jqrony is used by so many people, we are cautious about the patches we accept and want to be sure they don't have a negative impact on the millions of people using jqrony each day. For that reason it can take a while for any suggested patch to work its way through the review and release process. The reward for you is knowing that the problem you fixed will improve things for millions of sites and billions of visits per day.

### Build a Local Copy of jqrony

Create a fork of the jqrony repo on github at https://github.com/jqrony/jqrony

Change directory to your web root directory, whatever that might be:

```bash
$ cd /path/to/your/www/root/
```

Clone your jqrony fork to work locally

```bash
$ git clone git@github.com:username/jqrony.git
```

Change directory to the newly created dir jqrony/

```bash
$ cd jqrony
```

Add the jqrony main as a remote. I label mine "upstream"

```bash
$ git remote add upstream git://github.com/jqrony/jqrony.git
```

Get in the habit of pulling in the "upstream" main to stay up to date as jqrony receives new commits

```bash
$ git pull upstream main
```

Run the build script

```bash
$ npm run build
```

Now open the jqrony test suite in a browser at http://localhost/test. If there is a port, be sure to include it.

Success! You just built and tested jqrony!


### Test Suite Tips...

During the process of writing your patch, you will run the test suite MANY times. You can speed up the process by narrowing the running test suite down to the module you are testing by either double clicking the title of the test or appending it to the url. The following examples assume you're working on a local repo, hosted on your localhost server.

Example:

http://localhost/test/?module=css

This will only run the "css" module tests. This will significantly speed up your development and debugging.

**ALWAYS RUN THE FULL SUITE BEFORE COMMITTING AND PUSHING A PATCH!**


#### Loading changes on the test page

Rather than rebuilding jqrony with `npm run build` every time you make a change, you can use the included watch task to rebuild distribution files whenever a file is saved.

```bash
$ npm start
```

Alternatively, you can **load tests as ECMAScript modules** to avoid the need for rebuilding altogether.

Click "Load as modules" after loading the test page.


### Repo organization

The jqrony source is organized with ECMAScript modules and then compiled into one file at build time.

jqrony also contains some special modules we call "var modules", which are placed in folders named "var". At build time, these small modules are compiled to simple var statements. This makes it easy for us to share variables across modules. Browse the "src" folder for examples.

### Browser support

Remember that jqrony supports multiple browsers and their versions; any contributed code must work in all of them. You can refer to the [browser support page](https://jqrony.com/browser-support/) for the current list of supported browsers.
