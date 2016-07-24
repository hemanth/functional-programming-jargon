# asort.py
# author: Alex Scheller
# date: 7/23/2016
# version 1.0 (it gets the job done but the code could be waaaay better)
# purpose: This program alphabetizes the readme.md file while maintaining
# the markup for display on github

import sys

# converts generator values to list. This is honestly the result of
# either a lack of python knowledge on my part or it's just bad python
# NOTE this function was needed earlier but later the problem it was
# written to solve, I'm leaving this in here just in case the problem pops
# up again
def genToList(gen):
	ret = []
	for content in gen:
		for line in content:
			ret.append(line)
	return ret

# sorts the table of contents, could be a lot better
def sortToc(toc):
	head = []
	i = 0
	while toc[i][0:3] != "* [":
		head.append(toc[i])
		i += 1
	newToc = []
	while toc[i][0:3] == "* [":
		newToc.append(toc[i])
		i += 1
	tail = []
	while i < len(toc):
		tail.append(toc[i])
		i += 1
	newToc.sort()
	ret = []
	for thing in head:
		ret.append(thing)
	for thing in newToc:
		ret.append(thing)
	for thing in tail:
		ret.append(thing)
	return ret

# sorts the list of examples, could also be a lot better
def sortExamples(examples):
	# for line in examples:
	# 	print line
	temp = []
	i = 0
	# print examples
	# NOTE that this assumes any line that isn't a '\n' newline
	# is at least 2 chars long, this should be fixed in the future
	# just in case someone chooses to use one char on a line
	# by itself
	while i < len(examples):
		if "##" in examples[i]: # discovered new example
	 		example = [examples[i]]
	 		i += 1
	 		while (i < len(examples)) and (not ("##" in examples[i])):
	 			example.append(examples[i])
	 			i += 1
	 		temp.append(example)
	temp.sort(key=lambda x: x[0]) # sort by the title of the example
	ret = []
	for example in temp:
	 	for line in example:
	 		ret.append(line)
	return ret


# Separates the readme into relevant sections for further
# processing. NOTE that this is the most unstable section,
# since it relies on a specific format for the readme. It
# will need to be updated if the underlying document
# format changes. NOTE that the alphabetical sort relies
# on each example having only one leading space after the
# "##" markup identifier.
def seperateSections(text):

	i = 0

	preamble = []
	# searching for the <!-- RM(noparent,notop) --> that lies above
	# the table of contents
	while text[i][0:4] != "<!--":
		preamble.append(text[i])
		i += 1
	yield preamble

	toc = []
	# searching for the first "##" section
	while text[i][0:2] != "##":
		toc.append(text[i])
		i += 1
	yield toc

	examples = []
	# searching for the "__" PS section
	while text[i][0:2] != "__":
		examples.append(text[i])
		i += 1
	yield examples

	# this is the PS section
	yield text[i]

# sorts the examples in alphabetical order by catching "##" blocks
# found in the formatting of the readme.md file.
def sort(args):
	f = open("readme.md", "r")
	unsorted = f.readlines();
	f.close()
	preamble, toc, examples, ps = seperateSections(unsorted)

	toc = sortToc(toc)
	examples = sortExamples(examples)
	written = open("readme.md", "w")
	for line in preamble:
		written.write(line)
	for line in toc:
		written.write(line)
	for line in examples:
		written.write(line)
	written.write(ps)
	written.close()



# main currently serves no purpose but to pass on the arguments to sort.
# It is intended to provided the base for argument handling if the need
# arises.
def main(args):
	sort(args)

main(sys.argv[1:]) # strips the program name
	