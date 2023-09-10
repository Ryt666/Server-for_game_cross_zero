class DependencyInjection {
    instances = {};
  
    proxy = null;
  
    parent = null;
  
    static createRoot() {
      const di = new DependencyInjection();
      di.set('di', di);
      return di;
    }
  
    constructor(parent = null) {
      this.parent = parent;
  
      this.proxy = new Proxy({}, {
        get: (target, name) => this.get(name),
        set: (target, name, value) => this.set(name, value)
      });
    }
  
    set(name, value) {
      this.instances[name] = value;
    }
  
    get(nameOrClass) {
      const className = typeof nameOrClass === 'string' ? nameOrClass : nameOrClass.prototype.constructor.name;
      if (this.instances[className]) {
        return this.instances[className];
      }
      if (this.parent) {
        return this.parent.get(nameOrClass);
      }
      try {
        const clsConstr = typeof nameOrClass === 'string' ? eval(nameOrClass) : nameOrClass;
        this.instances[className] = new clsConstr(this.proxy);
        return this.instances[className];
      } catch (err) {
        // error in eval
      }
    }
  
    scope() {
      return new DependencyInjection(this);
    }
  }