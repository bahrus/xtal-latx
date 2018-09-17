self['xtal_latx_ied'] = function(s){
    var split1 = s.split(';');
    var lhs = split1[0];
    var re = /ref\.[a-z_A-Z]*/g;
    var args = [];
    while ((array1 = re.exec(lhs)) !== null) {
        args.push(array1[0].replace('ref.', ''))
    }
    const iOBPos = s.indexOf('{');
    const iLastCBPos = s.lastIndexOf('}');
    var body = s.substring(iOBPos, iLastCBPos + 1);
    return {
        args: args,
        body: body
    };
}