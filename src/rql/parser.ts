/* eslint-disable default-param-last */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable vars-on-top */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable block-scoped-var */
/* eslint-disable no-var */
/* eslint-disable no-useless-escape */
/* eslint-disable consistent-return */

/*
 * This file is heavily based on the work done by the good people at persvr
 * https://github.com/persvr/rql
 */

const operatorMap = {
  '=': 'eq',
  '==': 'eq',
  '>': 'gt',
  '>=': 'ge',
  '<': 'lt',
  '<=': 'le',
  '!=': 'ne',
};

const primaryKeyName = 'id';
const lastSeen = ['sort', 'select', 'values', 'limit'];
const jsonQueryCompatible = true;

function contains(array, item) {
  for (let i = 0, l = array.length; i < l; i++) {
    if (array[i] === item) {
      return true;
    }
  }
}

const autoConverted = {
  true: true,
  false: false,
  null: null,
  undefined,
  Infinity,
  '-Infinity': -Infinity,
};

const Query = function query() {
  this.name = 'and';
  this.args = [];
};

const converters = {
  auto(string) {
    // eslint-disable-next-line no-prototype-builtins
    if (autoConverted.hasOwnProperty(string)) {
      return autoConverted[string];
    }
    const number = +string;
    if (isNaN(number) || number.toString() !== string) {
      /* var isoDate = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?Z$/.exec(x);
           if (isoDate) {
             date = new Date(Date.UTC(+isoDate[1], +isoDate[2] - 1, +isoDate[3], +isoDate[4], +isoDate[5], +isoDate[6], +isoDate[7] || 0));
           } */
      string = decodeURIComponent(string);
      if (jsonQueryCompatible) {
        if (
          string.charAt(0) === "'" &&
          string.charAt(string.length - 1) === "'"
        ) {
          return JSON.parse(`"${string.substring(1, string.length - 1)}"`);
        }
      }
      return string;
    }
    return number;
  },
  number(x) {
    const number = +x;
    if (isNaN(number)) {
      throw new URIError(`Invalid number ${number}`);
    }
    return number;
  },
  epoch(x) {
    const date = new Date(+x);
    if (isNaN(date.getTime())) {
      throw new URIError(`Invalid date ${x}`);
    }
    return date;
  },
  isodate(x) {
    // four-digit year
    let date = '0000'.substr(0, 4 - x.length) + x;
    // pattern for partial dates
    date += '0000-01-01T00:00:00Z'.substring(date.length);
    return converters.date(date);
  },
  date(x) {
    const isoDate =
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?Z$/.exec(
        x
      );
    let date;
    if (isoDate) {
      date = new Date(
        Date.UTC(
          +isoDate[1],
          +isoDate[2] - 1,
          +isoDate[3],
          +isoDate[4],
          +isoDate[5],
          +isoDate[6],
          +isoDate[7] || 0
        )
      );
    } else {
      date = new Date(x);
    }
    if (isNaN(date.getTime())) {
      throw new URIError(`Invalid date ${x}`);
    }
    return date;
  },
  boolean(x) {
    return x === 'true';
  },
  string(string) {
    return decodeURIComponent(string);
  },
  re(x) {
    return new RegExp(decodeURIComponent(x), 'i');
  },
  RE(x) {
    return new RegExp(decodeURIComponent(x));
  },
  glob(x) {
    let s = decodeURIComponent(x)
      .replace(/([\\|\||\(|\)|\[|\{|\^|\$|\*|\+|\?|\.|\<|\>])/g, x => `\\${x}`)
      .replace(/\\\*/g, '.*')
      .replace(/\\\?/g, '.?');
    if (s.substring(0, 2) !== '.*') { s = `^${s}`; } else { s = s.substring(2); }
    if (s.substring(s.length - 2) !== '.*') { s += '$'; } else { s = s.substring(0, s.length - 2); }
    return new RegExp(s, 'i');
  },
};

export default function parse(
  /* String|Object */ query = '' as any,
  parameters?
) {
  var term = new Query();
  const topTerm = term;
  topTerm.cache = {}; // room for lastSeen params
  const topTermName = topTerm.name;
  topTerm.name = '';

  if (typeof query === 'object') {
    if (query instanceof Query) {
      return query;
    }

    for (const i in query) {
      var term = new Query();
      topTerm.args.push(term);
      term.name = 'eq';
      term.args = [i, query[i]];
    }

    return topTerm;
  }

  if (query.charAt(0) === '?') {
    throw new URIError('Query must not start with ?');
  }

  if (jsonQueryCompatible) {
    query = query
      .replace(/%3C=/g, '=le=')
      .replace(/%3E=/g, '=ge=')
      .replace(/%3C/g, '=lt=')
      .replace(/%3E/g, '=gt=');
  }

  if (query.indexOf('/') > -1) {
    // performance guard
    // convert slash delimited text to arrays
    query = query.replace(
      /[\+\*\$\-:\w%\._]*\/[\+\*\$\-:\w%\._\/]*/g,
      slashed => `(${slashed.replace(/\//g, ',')})`
    );
  }

  // convert FIQL to normalized call syntax form
  query = query.replace(
    /(\([\+\*\$\-:\w%\._,]+\)|[\+\*\$\-:\w%\._]*|)([<>!]?=(?:[\w]*=)?|>|<)(\([\+\*\$\-:\w%\._,]+\)|[\+\*\$\-:\w%\._]*|)/g,
    // <---------       property        -----------><------  operator -----><----------------   value ------------------>
    (_t, property, operator, value) => {
      if (operator.length < 3) {
        if (!operatorMap[operator]) {
          throw new URIError(`Illegal operator ${operator}`);
        }
        operator = operatorMap[operator];
      } else {
        operator = operator.substring(1, operator.length - 1);
      }
      return `${operator}(${property},${value})`;
    }
  );

  if (query.charAt(0) === '?') {
    query = query.substring(1);
  }

  const leftoverCharacters = query.replace(
    /(\))|([&\|,])?([\+\*\$\-:\w%\._]*)(\(?)/g,
    //   <-closedParan->|<-delim-- propertyOrValue -----(> |
    (_t, closedParan, delim, propertyOrValue, openParan) => {
      if (delim) {
        if (delim === '&') {
          setConjunction('and');
        }
        if (delim === '|') {
          setConjunction('or');
        }
      }
      if (openParan) {
        const newTerm = new Query();
        newTerm.name = propertyOrValue;
        newTerm.parent = term;
        call(newTerm);
      } else if (closedParan) {
        const isArray = !term.name;
        term = term.parent;
        if (!term) {
          throw new URIError(
            'Closing paranthesis without an opening paranthesis'
          );
        }
        if (isArray) {
          term.args.push(term.args.pop().args);
        }
      } else if (propertyOrValue || delim === ',') {
        term.args.push(stringToValue(propertyOrValue, parameters));

        // cache the last seen sort(), select(), values() and limit()
        if (contains(lastSeen, term.name)) {
          topTerm.cache[term.name] = term.args;
        }
        // cache the last seen id equality
        if (term.name === 'eq' && term.args[0] === primaryKeyName) {
          let id = term.args[1];
          if (id && !(id instanceof RegExp)) { id = id.toString(); }
          topTerm.cache[primaryKeyName] = id;
        }
      }
      return '';
    }
  );

  if (term.parent) {
    throw new URIError('Opening paranthesis without a closing paranthesis');
  }

  if (leftoverCharacters) {
    // any extra characters left over from the replace indicates invalid syntax
    throw new URIError(
      `Illegal character in query string encountered ${leftoverCharacters}`
    );
  }

  function call(newTerm) {
    term.args.push(newTerm);
    term = newTerm;
    // cache the last seen sort(), select(), values() and limit()
    if (contains(lastSeen, term.name)) {
      topTerm.cache[term.name] = term.args;
    }
  }

  function setConjunction(operator) {
    if (!term.name) {
      term.name = operator;
    } else if (term.name !== operator) {
      throw new Error(
        'Can not mix conjunctions within a group, use paranthesis around each set of same conjuctions (& and |)'
      );
    }
  }

  function removeParentProperty(obj) {
    if (obj && obj.args) {
      delete obj.parent;
      const { args } = obj;
      for (let i = 0, l = args.length; i < l; i++) {
        removeParentProperty(args[i]);
      }
    }
    return obj;
  }

  removeParentProperty(topTerm);
  if (!topTerm.name) {
    topTerm.name = topTermName;
  }

  return topTerm;
}

function stringToValue(string, parameters) {
  let converter = converters.auto;
  if (string.charAt(0) === '$') {
    const paramIndex = parseInt(string.substring(1), 10) - 1;
    return paramIndex >= 0 && parameters ? parameters[paramIndex] : undefined;
  }
  if (string.indexOf(':') > -1) {
    if (!isNaN(Date.parse(string))) {
      return converter(string);
    }
    const parts = string.split(':');
    converter = converters[parts[0]];
    if (!converter) {
      throw new URIError(`Unknown converter ${parts[0]}`);
    }
    string = parts.slice(1).join(':');
  }
  return converter(string);
}
