const os = require('os')
const fs = require('fs')
const test = require('tap').test
const rocksdb = require('../build/Release/rocksdb.node')
const path = os.tmpdir() + '/rocksdbBasicTest'
let db

test('setup', function (t) {
  db = rocksdb.open({create_if_missing: true}, path)
  t.ok(db)
  t.end()
})

test('simple sync put/get/delete', function (t) {
  db.put('rocks', 'db')
  t.equal(db.get('rocks'), 'db')
  db.del('rocks')
  t.equal(db.get('rocks'), null)
  t.end()
})

test('get non-existent key', function (t) {
  t.notOk(db.get('nokey'))
  t.end()
})

test('delete non-existent key', function (t) {
  t.notOk(db.del('nokey'))
  t.end()
})

test('wrong args constructor', function (t) {
  t.throws(function () {
    rocksdb.open()
  }, /Wrong number of arguments/)

  t.end()
})

test('wrong args put', function (t) {
  t.throws(function () {
    db.put()
  }, /Wrong number of arguments/)
  t.end()
})

test('wrong args get', function (t) {
  t.throws(function () {
    db.get()
  }, /Wrong number of arguments/)
  t.end()
})

test('close database', function (t) {
  db.close()
  t.throws(function () {
    db.put('foo', 'bar')
  }, /Database is not open/)

  t.throws(function () {
    db.get('foo')
  }, /Database is not open/)

  t.throws(function () {
    db.del('foo')
  }, /Database is not open/)

  t.throws(function () {
    db.close()
  }, /Database is not open/)

  t.end()
})

test('destroy database', function (t) {
  t.ok(fs.existsSync(path))
  rocksdb.destroyDB(path)
  t.ok(!fs.existsSync(path))
  t.end()
})
