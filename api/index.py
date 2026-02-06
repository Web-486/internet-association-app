import os
import sys

# 将 backend 目录添加到系统路径
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(current_dir, '..', 'backend')
sys.path.insert(0, backend_dir)

from main import app
