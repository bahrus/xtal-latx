# xtal-latx
Base Element for xtal custom elements

xtal-latx dreams the impossible dream -- be able to progressively, declaratively, glue components together in a relatively "framework-less" way, where the browser is the only framework that really matters.  It does this by reflecting properties of other components down to other components as they change.

xtal-latx has an attribute/property, "on" that can have a pipe delimited list of events or attribute changes it monitors for.  It monitors the previous sibling, and passes it down the sibling list.

## Unidirectional data flow across downward siblings

```html
<div style="display:grid">
    <text-box></text-box>                                                       <xtal-latx on="input"           pass-down="{input}">                    </xtal-latx>
    <prepend-string prepend="api/allEmployees?startsWidth="></prepend-string>   <xtal-latx on="output-changed"  pass-down="{url:value}">                </xtal-latx>
    <fetch-data></fetch-data>                                                   <xtal-latx on="fetch-complete"  pass-down="my-filter{items}">           </xtal-latx>
    <my-filter select="isActive"></my-filter>                                   <xtal-latx on="output-changed"  pass-down="#activeList{items:value}">   </xtal-latx>
    <my-filter select="!isActive"></my-filter>                                  <xtal-latx on="output-changed"  pass-down="#inactiveList{items:value}"> </xtal-latx>
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
    <text-box></text-box>                                                       <l-l on="input"             pd>                              </l-l>
    <prepend-string prepend="api/allEmployees?startsWidth="></prepend-string>   <l-l                        pd="{url:value}">                </l-l>
    <fetch-data></fetch-data>                                                   <l-l on="fetch-complete"    pd="my-filter{items}">           </l-l>
    <my-filter select="isActive"></my-filter>                                   <l-l                        pd="#activeList{items:value}">   </l-l>
    <my-filter select="!isActive"></my-filter>                                  <l-l                        pd="#inactiveList{items:value}"> </l-l>
    <h3>Active</h3>
    <my-grid id="activeList"></my-grid>
    <h3>Inactive</h3>
    <my-grid id="inactiveList"><my-grid>
</div>
```




