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
    <text-box></text-box>                                                               <xtal-latx on="input" pass-down="div" for-all="prepend-string{input}"></xtal-latx>
    <div>
        <prepend-string prepend="api/allEmployees?startsWidth="></prepend-string>
    </div>
```

## Short cuts

We've already seen that if no css specifier comes before the open {, just pass down to the next sibling and stop.

Additional shortcuts:

Assume input, output, abbreviate tag name, pass-down:


```html
<div style="display:grid">
    <text-box></text-box><p-d on="input"></p-d>
    <prepend-string prepend="api/allEmployees?startsWidth="></prepend-string><p-d to="{url:value}"></p-d>
    <fetch-data></fetch-data><p-d on="fetch-complete" to="my-filter{items}"></p-d>
    <my-filter select="isActive"></my-filter><p-d to="#activeList{items:value}"></p-d>
    <my-filter select="!isActive"></my-filter><p-d to="#inactiveList{items:value}"> </p-d>
    <h3>Active</h3>
    <my-grid id="activeList"></my-grid>
    <h3>Inactive</h3>
    <my-grid id="inactiveList"><my-grid>
</div>
```

It appears that the css-grid doesn't count elements with display:none as columns or rows.

So all the non visual components could use host: display: none.


