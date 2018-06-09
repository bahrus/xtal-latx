# xtal-latx
Base Mixin for xtal-* custom elements

Also home to custom element p-d, which stands for "pass down."

xtal-latx dreams the impossible dream -- be able to progressively, declaratively, glue components together in a relatively "framework-less" way, where the browser is the only framework that really matters.  It does this by reflecting properties of "producer" components down to other "consumer" components as they change.

xtal-latx has an attribute/property, "on" that can have a pipe delimited list of events or attribute changes it monitors for.  It monitors the previous sibling, and passes it down the sibling list.

## Unidirectional data flow across downward siblings

```html
<!--- verbose syntax -->
<div style="display:grid">
    <input/>                                                                    <p-d on="input"         to="prepend-string{input:value}" max-matches="1"></p-d>
    <prepend-string prepend="api/allEmployees?startsWidth="></prepend-string>   <p-d on="value-changed" to="fetch-data{url:value}" max-matches="1"></p-d>
    <fetch-data></fetch-data>                                                   <p-d on="value-changed" to="my-filter{input:value}"max-matches="2"></p-d>
    <my-filter select="isActive"></my-filter>                                   <p-d on="value-changed" to="#activeList{items:value}" max-matches="1"></p-d>
    <my-filter select="!isActive"></my-filter>                                  <p-d on="value-changed" to="#inactiveList{items:value}" max-matches="1"> </p-d>
    <h3>Active</h3>
    <my-grid id="activeList"></my-grid>
    <h3>Inactive</h3>
    <my-grid id="inactiveList"><my-grid>
</div>
```


It appears that the css flex/grid doesn't count elements with display:none as columns or rows.

So all the non visual components could use an attribute, nv (non visual) and apply a style for them, i.e.: 

```html
<style>
[nv]{
    display: none;
}
</style>
```

```html
<!-- abreviated syntax -->
<style>
[nv]{
    display:none;
}
</style>
<div style="display:grid">
    <input/>                                                                    <p-d on="input"></p-d>
    <prepend-string prepend="api/allEmployees?startsWidth=">
    </prepend-string>                                                           <p-d to="{url}"></p-d>
    <fetch-data nv></fetch-data>                                                <p-d to="my-filter" m="2"></p-d>
    <my-filter nv select="isActive"></my-filter>                                <p-d to="#activeList{items}" m="1"></p-d>
    <my-filter nv select="!isActive"></my-filter>                               <p-d on="value-changed" to="#inactiveList{items}" m="1"></p-d>
    <h3>Active</h3>
    <my-grid id="activeList"></my-grid>
    <h3>Inactive</h3>
    <my-grid id="inactiveList"><my-grid>
</div>
```


## Sibling cascade

```html
    <text-box></text-box>                                                               <p-d on="input" to="div" for-all="prepend-string{input}"></p-d>
    <div>
        <prepend-string prepend="api/allEmployees?startsWidth="></prepend-string>
    </div>
```

## Loops

Looping is by necessity going to involve data flowing two ways. I'm not talking here about generating a list of items, but rather a circular flow of data, which I can't see how an application would avoid.  If one page hyperlinks to another page, which links to a third page, which links back to the first page, we have data flowing in a circular fashion.  

Every programming language I'm familiar with allows this to happen via clearly defined cycles.  I.e. the direction of the data doesn't suddenly reverse, but rather, the control goes back to a cleary marked starting point again. Recursive functions or for loops are the classic example. 

In the DOM world, one could argue that using events is more confusing than a programming language, because in a way the direction of the data flow *does* suddenly go into reverse, and it's not obvious inspecting the tree of DOM what impact the event will have. Where does it stop?  Some intermediate DOM elements could take action on the event, passing down new data, but allow the event to continue propagating up, which could do something similar.   At least I'm guessing that's what causes people to reach for global state management so eagerly.  Honestly, this whole discussion is quite foreign to me, as I've not really experienced any issues with any two-way binding system.  I'm just relying on people's vague hand waving "this way avoids difficult to debug scenarios, take my word for it".  Okay.

But relying on a central place to manage state seems like more jumping around between files, more opportunities for accidental conflicts, more challenging performance issues.   Or why would we have local variables? 

 Clearly the appeal of central management is quite strong. Pol Pot and Hugo Chavez didn't rise to power without supporters. Some people like climbing to Mount Everest in order to tie their shoes, and then make movies about how many limbs they lost in the process.  Some people prefer to talk to their kids / parents, sitting across from them a the dinner table, via their cell phones.  Some people go to a magic show, wearing their Google Glasses, so they can quickly go home and watch the video over and over again, until they can figure out the trick.  A small part of me sees the appeal, but a very small part.  I like point and click, spare me the details, keep everything close, decentralized and simple.

So what would an alternative, declarative looping mechanism look like that doesn't involve events or global state management?

I think the answer is using ID's.  ID's must be unique, outside of the shadow DOM.  In a nod\ to the people who don't like data to flow any direction other than top down, the element is called p-u.

Suppose you create a little program that will calculate the third number, given a + b = c, where the user can edit a, b, or c (one at a time):

```html
<solve-algebra-problem nv id="sumSolver"></solve-algebra-problem><p-d on="first-operand-update" to="#a{value}"/><p-d on="rh_update" to "#b{value}"/>
<input id="a"/><p-d on="input" to="#c{leftOperand}"></p-d>
<input id="b"/><p-d on="input" to="#c{rightOperand}"</p-d>
<input id="c"/><p-u on="input" to="sumSolver{leftOperand:leftOperand;rightOperand:rightOperand;sum:value}"
```

