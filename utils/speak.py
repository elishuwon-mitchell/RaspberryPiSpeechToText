# coding: utf-8

from subprocess import call


cmd_beg= 'espeak '
cmd_end= ' 2>/dev/null' # To play back the stored .wav file and to dump the std errors to /dev/null

options = ["-ven+f5"]
space = " "

sentence = '\"Bonjour le monde."'
#sentence = '\"You are my creator, Elie."'

command = cmd_beg;

#append all options to command
for option in options:
	command = command + option + space
	
#append text to say
command = command + sentence

#append ending command 
command  = command + cmd_end

#Calls the Espeak TTS Engine to read aloud a Text
call([command], shell=True)

