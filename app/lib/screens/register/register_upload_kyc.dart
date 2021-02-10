import 'package:flutter/material.dart';

class RegisterUploadKYC extends StatefulWidget {
  static Route route() {
    return MaterialPageRoute(builder: (_) => RegisterUploadKYC());
  }

  @override
  _RegisterUploadKycState createState() => _RegisterUploadKycState();
}

class _RegisterUploadKycState extends State<RegisterUploadKYC> {
  @override
  Widget build(BuildContext context) {
    return Container(
      child: Text('upload'),
    );
  }

}