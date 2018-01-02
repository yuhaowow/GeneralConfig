import os
import git
from git import *

def isGitDir(dir):
    repdir = os.path.join(os.path.abspath('.'), dir)
    repgitdir = os.path.join(repdir, '.git')
    if not os.path.exists(repgitdir):
        return False
    return True

currDir = os.path.abspath('.')
subDirs = [x for x in os.listdir('.') if isGitDir(x)]
print("ready to update git repo:")
for dir in subDirs:
    print(dir+ '\r\n')
dirSubDir = []

def updateSub(subdir):
    repdir = os.path.join(os.path.abspath('.'), subdir)

    print('start creat repo from dir %s' %repdir)
    try:
        repo = git.Repo(repdir)
        if repo.is_dirty():
            dirSubDir.append(subdir)
            return
        remote = repo.remote()
        print("start pulling update from remote server for: %s" %subdir)
        remote.pull()
    except NoSuchPathError as e:
        pass
    except InvalidGitRepositoryError as e:
        pass
    finally:
        pass



for subdir in subDirs:
    updateSub(subdir)

for dirtyDir in dirSubDir:
    print('dir %s has uncommited change, please check' % dirtyDir)