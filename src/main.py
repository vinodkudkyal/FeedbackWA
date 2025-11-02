import socket

def get_ip_address():
    try:
        # Connect to an external server to get the machine's IP address
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            # Doesn't need to actually send data
            s.connect(("8.8.8.8", 80))
            ip_address = s.getsockname()[0]
        return ip_address
    except Exception as e:
        return f"Error occurred: {e}"

if __name__ == "__main__":
    ip = get_ip_address()
    print(f"The IP address of this machine is: {ip}")
