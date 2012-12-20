/**
 * @fileOverview  This file has collection module.
 */

/**
 * @module  collection
 */

(function(undefined) {
  var Iterator = (function() {
    /**
     * Create a new Iterator object.
     * @memberOf  module:collection
     * @class     Iterator  class takes the place of enumeration (like java).
     *                      In Iterator, iteration is performed towards an end from a head.
     * @param     {module:collection.Collection} collection - Iterate for.
     */
    function Iterator(collection) {
      this._collection = collection;
      this._pos = 0;
      this._removedOnce = true;
    }

    /**
     * @memberOf  module:collection.Iterator.prototype
     * @name      hasNext
     * @function
     * @returns   {Boolean} true if the iteration has more items.
     */
    Iterator.prototype.hasNext = function() {
      return (this._pos < this._collection.size());
    };

    /**
     * @memberOf  module:collection.Iterator.prototype
     * @name      next
     * @function
     * @returns   {Object}  The next element in the iteration.
     */
    Iterator.prototype.next = function() {
      this._removedOnce = false;
      return this._collection.getAt(this._pos++);
    };

    /**
     * @memberOf  module:collection.Iterator.prototype
     * @name      pos
     * @function
     * @returns   {number}  The index which Iterator object has pointed out now.
     */
    Iterator.prototype.pos = function() {
      return this._pos;
    };

    /**
     * @memberOf  module:collection.Iterator.prototype
     * @name      size
     * @function
     * @returns   {number}  Length of iteration.
     */
    Iterator.prototype.size = function() {
      return this._collection.size();
    };

    /**
     * Removes from the underlying collection the last element returned by the iterator.
     * @memberOf  module:collection.Iterator.prototype
     * @name      remove
     * @function
     */
    Iterator.prototype.remove = function() {
      if (this._removedOnce) {
        throw new Error("Iterator: Illegal State.");
      }
      this._collection.removeAt(--this.pos);
      this._removedOnce = true;
    };
    return Iterator;
  })();

  var ReverseIterator = (function() {
    /**
     * Create a new ReverseIterator object.
     * @memberOf  module:collection
     * @class     ReverseIterator class takes the place of enumeration (like java).
     *                            In ReverseIterator, iteration is performed towards a head from an end..
     * @param     {module:collection.Collection}  collection  - Iterate for.
     */
    function ReverseIterator(collection) {
      this._collection = collection;
      this._pos = this._collection.size() - 1;
      this._removedOnce = true;
    }

    /**
     * @memberOf  module:collection.ReverseIterator.prototype
     * @name      hasNext
     * @function
     * @returns   {boolean} true if the iteration has more items.
     */
    ReverseIterator.prototype.hasNext = function() {
     return (this._pos >= 0);
    };

    /**
     * @memberOf  module:collection.ReverseIterator.prototype
     * @name      next
     * @function
     * @returns   {Object}  The next element in the iteration.
     */
    ReverseIterator.prototype.next = function() {
      this._removedOnce = false;
      return this._collection.getAt(this._pos--);
    };

    /**
     * @memberOf  module:collection.ReverseIterator.prototype
     * @name      pos
     * @function
     * @returns   {number}  The index which ReverseIterator object has pointed out now.
     */
    ReverseIterator.prototype.pos = function() {
      return this._pos;
    };

    /**
     * @memberOf  module:collection.ReverseIterator.prototype
     * @name      size
     * @function
     * @returns   {number}  Length of iteration.
     */
    ReverseIterator.prototype.size = function() {
      return this._collection.size();
    };

    /**
     * Removes from the underlying collection the last element returned by the iterator.
     * @memberOf  module:collection.ReverseIterator.prototype
     * @name      remove
     * @function
     * @throws    {Error} #remove() can be called only to once per 1 iteration.
     */
    ReverseIterator.prototype.remove = function() {
      if (this._removedOnce) {
        throw new Error("Iterator: Illegal State.");
      }
      this._collection.removeAt(++this.pos);
      this._removedOnce = true;
    };
    return ReverseIterator;
  })();

  var Collection = (function() {
    /**
     * Create a new Collection Object like java.
     * @memberOf  module:collection
     * @class     Collection  is a class which mounted the function the function
     *                        of the collection interface of java.
     */
    function Collection() {
      this._holder = [];
    }

    /**
     * @memberOf  module:collection.Collection.prototype
     * @name      size
     * @function
     * @returns   {number}
     */
    Collection.prototype.size = function() {
      return this._holder.length;
    };

    /**
     * @memberOf  module:collection.Collection.prototype
     * @name      getAt
     * @function
     * @param     {number}  index -
     * @returns   {Object}
     */
    Collection.prototype.getAt = function(index) {
      return this._holder[index];
    };

    /**
     * @memberOf  module:collection.Collection.prototype
     * @name      add
     * @function
     * @param     {Object}  item -
     * @returns   {boolean}
     */
    Collection.prototype.add = function(item) {
      this._holder.push(item);
      return true;
    };

    /**
     * @memberOf  module:collection.Collection.prototype
     * @name      addAll
     * @function
     * @param     {module:collection.Collection}  collection  -
     * @returns   {boolean}
     */
    Collection.prototype.addAll = function(collection) {
      this._holder.push.apply(this, collection.toArray());
      return true;
    };

    /**
     * @memberOf  module:collection.Collection.prototype
     * @name      clear
     * @function
     */
    Collection.prototype.clear = function() {
      this._holder = [];
    };

    /**
     * @memberOf  module:collection.Collection.prototype
     * @name      contains
     * @function
     * @param     {Object}  item
     * @returns   {boolean}
     */
    Collection.prototype.contains = function(item) {
      return (this._holder.indexOf(item) > -1);
    };

    /**
     * @memberOf  module:collection.Collection.prototype
     * @name      containsAll
     * @function
     * @param     {module:collection.Collection}  collection  -
     * @returns   {boolean}
     */
    Collection.prototype.containsAll = function(collection) {
      for (var itr = collection.iterator(); itr.hasNext();) {
        if (!this.contains(itr.next())) { return false; };
      }
      return true;
    };

    /**
     * @memberOf  module:collection.Collection.prototype
     * @name      equals
     * @function
     * @param     {Object}  obj
     * @returns   {boolean}
     */
    Collection.prototype.equals = function(obj) {
      return (this === obj);
    };

    /**
     * @memberOf  module:collection.Collection.prototype
     * @name      isEmpty
     * @function
     * @returns   {boolean}
     */
    Collection.prototype.isEmpty = function() {
      return (this._holder.length === 0);
    };

    /**
     * @memberOf  module:collection.Collection.prototype
     * @name      iterator
     * @function
     * @returns   {module.collection.Iterator}
     */
    Collection.prototype.iterator = function() {
      return new Iterator(this);
    };

    /**
     * @memberOf  module:collection.Collection.prototype
     * @name      reverseIterator
     * @function
     * @returns   {module.collection.ReverseIterator}
     */
    Collection.prototype.reverseIterator = function() {
      return new ReverseIterator(this);
    };

    /**
     * @memberOf  module:collection.Collection.prototype
     * @name      remove
     * @function
     * @param     {Object}  item
     * @returns   {boolean}
     */
    Collection.prototype.remove = function(item) {
      var index = this._holder.indexOf(item);
      if (index == -1) { return false; }
      this._holder.splice(index, 1);
      return true;
    };

    /**
     * @memberOf  module:collection.Collection.prototype
     * @name      removeAt
     * @function
     * @param     {number}  index
     * @returns   {boolean}
     */
    Collection.prototype.removeAt = function(index) {
      if (index < 0) { return false; }
      if (index >= this._holder.length) { return false; }
      this._holder.splice(index, 1);
      return true;
    };

    /**
     * @memberOf  module:collection.Collection.prototype
     * @name      removeAll
     * @function
     * @param     {module:collection.Collection}  collection  -
     * @returns   {boolean}
     */
    Collection.prototype.removeAll = function(collection) {
      var changed = false;
      for (var itr = this.iterator(); itr.hasNext();) {
        if (!collection.contains(itr.next())) { continue; }
        itr.remove();
        changed = true;
      }
      return changed;
    };

    /**
     * @memberOf  module:collection.Collection.prototype
     * @name      retainAll
     * @function
     * @param     {module:collection.Collection}  collection  -
     * @returns   {boolean}
     */
    Collection.prototype.retainAll = function(collection) {
      var changed = false;
      for (var itr = this.iterator(); itr.hasNext();) {
        if (collection.contains(itr.next())) { continue; }
        itr.remove();
        changed = true;
      }
      return changed;
    };

    /**
     * @memberOf  module:collection.Collection.prototype
     * @name      toArray
     * @function
     * @returns   {Array}
     */
    Collection.prototype.toArray = function() {
      return this._holder.concat();
    };

    /**
     * @memberOf  module:collection.Collection
     * @name      createFromArray
     * @function
     * @static
     * @param     {Array} array -
     * @returns   {module:collection.Collection}
     */
    Collection.createFromArray = function(array) {
      var collection = new Collection();
      collection._holder = array;
      return collection;
    };
    return Collection;
  })();

  var ArrayList = (function(super) {
    __inherit(ArrayList, super);

    /**
     * Create a new ArrayList object.
     * @memberOf  module:collection
     * @class     ArrayList is a class which mounted the function the function
     *                      of the ArrayList interface of java.
     * @extends   module:collection.Collection
     */
    function ArrayList() {
      super.call(this, arguments);
    }

    /**
     * @memberOf  module:collection.ArrayList.prototype
     * @name      addAt
     * @function
     * @param     {number}  index
     * @param     {Object}  item
     * @returns   {boolean}
     */
    ArrayList.prototype.addAt = function(index, item) {
      if (index < 0) { return false; }
      if (index > this._holder.length) { return false; }
      this._holder.splice(index, 0, item);
      return true;
    };

    /**
     * @memberOf  module:collection.ArrayList.prototype
     * @name      addAllAt
     * @function
     * @param     {number}                        index       -
     * @param     {module:collection.Collection}  collection  -
     * @returns   {boolean}
     */
    ArrayList.prototype.addAllAt = function(index, collection) {
      if (index < 0) { return false; }
      if (index > this._holder.length) { return false; }
      var args = [];
      args.push(index, 0);
      args.push.apply(null, collection.toArray());
      this._holder.splice.apply(this, args);
      return true;
    };

    /**
     * @memberOf  module:collection.ArrayList.prototype
     * @name      addAllAt
     * @function
     * @param     {number}                        index       -
     * @param     {module:collection.Collection}  collection  -
     * @returns   {boolean}
     */
    ArrayList.prototype.clone = function() {
      return ArrayList.createFromArray(this.toArray());
    };

    /**
     * @memberOf  module:collection.ArrayList.prototype
     * @name      indexOf
     * @function
     * @param     {module:collection.Collection}  collection  -
     * @returns   {number}
     */
    ArrayList.prototype.indexOf = function(item) {
      return this._holder.indexOf(item);
    };

    /**
     * @memberOf  module:collection.ArrayList.prototype
     * @name      lastIndexOf
     * @function
     * @param     {module:collection.Collection}  collection  -
     * @returns   {number}
     */
    ArrayList.prototype.lastIndexOf = function(item) {
      return this._holder.lastIndexOf(item);
    };

    /**
     * @memberOf  module:collection.ArrayList.prototype
     * @name      set
     * @function
     * @param     {number}  index
     * @param     {Object}  item
     * @returns   {boolean}
     */
    ArrayList.prototype.set = function(index, item) {
      if (index < 0) { return false; }
      if (index > this._holder.length) { return false; }
      this._holder.splice(index, 1, item);
    };

    /**
     * @memberOf  module:collection.ArrayList
     * @name      createFromArray
     * @function
     * @static
     * @param     {Array} array
     * @returns   {module:collection.ArrayList}
     */
    ArrayList.createFromArray = function(array) {
      var arrayList = new ArrayList();
      arrayList._holder = array;
      return arrayList;
    };
    return ArrayList;
  })(Collection);

  var Deque = (function(super) {
    __inherit(Deque, super);

    /**
     * Create a new Deque object.
     * @memberOf  module:collection
     * @class     Deque is a class which mounted the function the function
     *                  of the Deque interface of java.
     * @extends   module:collection.ArrayList
     */
    function Deque() {
      super.call(this, arguments);
    }

    /**
     * @memberOf  module:collection.Deque.prototype
     * @name      head
     * @function
     * @returns   {Object}
     */
    Deque.prototype.head = function() {
      if (this._holder.length <= 0) { return null; }
      return this._holder[0];
    };

    /**
     * @memberOf  module:collection.Deque.prototype
     * @name      pop
     * @function
     * @returns   {Object}
     */
    Deque.prototype.pop = function() {
      return this._holder.pop();
    };

    /**
     * @memberOf  module:collection.Deque.prototype
     * @name      push
     * @function
     * @param     {Object}
     */
    Deque.prototype.push = function(item) {
      this._holder.push(item);
    };

    /**
     * @memberOf  module:collection.Deque.prototype
     * @name      shift
     * @function
     * @returns   {Object}
     */
    Deque.prototype.shift = function() {
      return this._holder.shift();
    };

    /**
     * @memberOf  module:collection.Deque.prototype
     * @name      tail
     * @function
     * @returns   {Object}
     */
    Deque.prototype.tail = function() {
      if (this._holder.length <= 0) { return null; }
      var lastIndex = this._holder.length - 1;
      return this._holder[lastIndex];
    };

    /**
     * @memberOf  module:collection.Deque.prototype
     * @name      unshift
     * @function
     * @param     {Object}
     */
    Deque.prototype.unshift = function(item) {
      this._holder.unshift(item);
    };

    /**
     * @memberOf  module:collection.Deque
     * @name      createFromArray
     * @function
     * @static
     * @param     {Array} array
     * @returns   {module:collection.ArrayList}
     */
    Deque.createFromArray = function(array) {
      var deque = new Deque();
      deque._holder = array;
      return deque;
    };
    return Deque;
  })(ArrayList);

  exports.Iterator = Iterator;
  exports.ReverseIterator = ReverseIterator;
  exports.Collection = Collection;
  exports.ArrayList = ArrayList;
  exports.Deque = Deque;
})();

