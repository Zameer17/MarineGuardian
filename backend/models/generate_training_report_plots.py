import os
import sys

# Forwarder to master_generate_training_report_plots.py
if __name__ == "__main__":
    import subprocess
    script = os.path.join(os.path.dirname(__file__), "master_generate_training_report_plots.py")
    subprocess.run([sys.executable, script], check=True)
