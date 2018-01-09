import git
from git import *
import threading
import os

def isGitDir(dir):
    repdir = os.path.join(os.path.abspath('.'), dir)
    repgitdir = os.path.join(repdir, '.git')
    if not os.path.exists(repgitdir):
        return False
    return True
def updateSub(subdir):
    repdir = os.path.join(os.path.abspath('.'), subdir)
    try:
        repo = git.Repo(repdir)
        if repo.is_dirty():
            dirSubDir.append(subdir)
            return
        remote = repo.remote()
        print("start pulling from remote for: %s\r\n" %subdir)
        remote.pull()
        print("Done pulling for %s\r\n" %subdir)
    except NoSuchPathError as e:
        pass
    except InvalidGitRepositoryError as e:
        pass
    finally:
        pass

currDir = os.path.abspath('.')
subDirs = [x for x in os.listdir('.') if isGitDir(x)]
print("ready to update git repo:")
for dir in subDirs:
    print(dir+ '\r\n')
dirSubDir = []
poole = []
for subdir in subDirs:
    t = threading.Thread(target=updateSub,args=(subdir,))
    t.start()
    poole.append(t)
for t in poole:
    t.join(30)

print('\r\n')
if len(dirSubDir)!= 0:
    print('these repos have uncommitted changes:')
    for dirtyDir in dirSubDir:
        print('dir %s has uncommited change, please check' % dirtyDir)
