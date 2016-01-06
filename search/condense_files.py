from bs4 import BeautifulSoup

base = open('base.html').read()

soup = BeautifulSoup(base)

# links = soup.find_all('link')

# for l in links:
# 	filename = l['href']
# 	contents = open(filename).read()
# 	css_tag = BeautifulSoup('<style>\n' + contents + '</style>\n')
# 	l.replace_with(css_tag)

soup = BeautifulSoup(str(soup))

scripts = soup.find_all('script')

for s in scripts:
	if not 'src' in s.attrs:
		continue
	script = open(s['src']).read()
	del s['src']
	s.string = script

open('build.html', 'w').write(soup.prettify())
