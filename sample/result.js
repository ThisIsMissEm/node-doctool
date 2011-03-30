{
	modules: {
		fs: {
			name: "File System",
			require: "fs",
			description: [
				{type: "text", value: "File I/O is provided by simple wrappers around standard POSIX functions.  To use this module do `require('fs')`. All the methods have asynchronous and synchronous forms."},
				{type: "code", value: "var fs = require('fs');\n\nfs.unlink('/tmp/hello', function (err) {\nif (err) throw err;\nconsole.log('successfully deleted /tmp/hello');\n});"}
			],
			methods: {
				"rename": {
					signature: "(path1, path2, [callback])",
					params: {
						"path1": {type: ["String"], description: "The original file path"}
						"path2": {type: ["String", "Foo"], description: "The new file path"}
						"callback" {type: ["Function(err)"], description: "Optional [callback](../callbacks.html)."}
					},
					description: [
						{type: "text", value: "Asynchronous [rename(2)](http://kernel.org/doc/man-pages/online/pages/man2/rename.2.html)."}
					]
				}
			}
		}
	}
}