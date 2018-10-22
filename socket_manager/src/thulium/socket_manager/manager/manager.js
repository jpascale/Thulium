class Manager{

  constructor(type) {
    this._type = type;
  }

  manage(msg){
    let splitString = msg.split("");
    switch (this._type) {
      case "echo":
        return splitString.join("");
      case "reverse":
        return splitString.reverse().join("");
    }
  }
}

exports.Manager = Manager;