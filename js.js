// var apiURL = 'https://api.github.com/repos/byr-gdp/byr-gdp.github.io/commits?per_page=3&sha='
var apiURL = 'https://api.github.com/repos/yyx990803/vue/commits?per_page=3&sha='
var apiURL2 = 'https://api.github.com/repos/byr-gdp/bookTrade/branches'

var apiRepo = 'https://api.github.com/users/'
var apiBranch = 'https://api.github.com/repos/'
var apiSubmit = 'https://api.github.com/repos/'

var demo = new Vue({
	el: '#demo',
	data: {
		username: 'byr-gdp',
		// branches: ['master', 'dev', 'next'],

		//获取用户repo信息
		repos: null,
		
		//获取到的分支信息
		branches: null,
		
		//当前Repo
		currentRepo: null,

		//当前分支
		currentBranch: null,

		//提交情况
		commits: null,

		//显示提交信息数量
		num: null
	},
	created: function() {

		//获取用户repo信息
		this.fetchRepoData();
		this.$watch('username', function() {
			this.fetchRepoData();
		})


		//获取用户repo分支信息
		// this.fetchBranchData();
		this.$watch('currentRepo', function(){
			this.fetchBranchData();
		})

		//获取用户分支提交信息
		this.$watch('currentBranch', function() {
			this.fetchSubmitData();
		})

		//获取显示提交信息数量
		this.$watch('num', function() {
			this.fetchSubmitData();
		})
	},
	filters: {
		truncate: function(v) {
			if(v){
				var newline = v.indexOf('\n');
				return newline > 0 ? v.slice(0, newline): v
			}
		},
		formatDate: function(v) {
			return v.replace(/T|Z/g, '')
		}
	},
	methods: {
		fetchRepoData: function() {
			var xhr = new XMLHttpRequest();
			var self = this;
			xhr.open('GET', apiRepo + self.username + '/repos');
			xhr.onload = function() {
				self.repos = JSON.parse(xhr.responseText);
			}
			xhr.send();
			this.currentRepo = null;
			this.currentBranch = null;
			this.commits = null;
		},
		fetchBranchData: function() {
			//防止因切换用户currentRepo置空引发无法刷新repo的问题
			if(this.currentRepo == null){
				this.branches = null;
				return;
			}
			var xhr = new XMLHttpRequest();
			var self = this;
			xhr.open('GET', apiBranch + self.username + '/' + self.currentRepo + '/branches');
			xhr.onload = function() {
				self.branches = JSON.parse(xhr.responseText);
			}
			xhr.send();
			this.currentBranch = null;
			this.commits = null;
		},

		fetchSubmitData: function() {
			//切换repo后置currentBranch & commits 为空
			//防止引发刷新commits操作
			if(this.currentBranch == null) {
				return;
			}
			var xhr = new XMLHttpRequest();
			var self = this;
			xhr.open('GET', apiSubmit + self.username + '/' + self.currentRepo + '/commits?per_page=' + self.num + '&sha=' + self.currentBranch); 
			xhr.onload = function() {
				self.commits = JSON.parse(xhr.responseText);
			}
			xhr.send();
		}
	}
})

