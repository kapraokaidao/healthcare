import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:healthcare_app/app.dart';
import 'package:healthcare_app/authentication/authentication.dart';
import 'package:healthcare_app/authentication/bloc/authentication_bloc.dart';
import 'package:healthcare_app/screens/token/token_screen.dart';
import 'package:healthcare_app/utils/index.dart';
import 'package:image_picker/image_picker.dart';

class RegisterUploadKYC extends StatefulWidget {
  static Route route() {
    return MaterialPageRoute(builder: (_) => RegisterUploadKYC());
  }

  @override
  _RegisterUploadKycState createState() => _RegisterUploadKycState();
}

class _RegisterUploadKycState extends State<RegisterUploadKYC> {
  File _nationalIdImage;
  File _selfieImage;
  final picker = ImagePicker();

  void submitKycImages(BuildContext context) async {
    // print(_nationalIdImage);
    // print(_selfieImage);
    if (_nationalIdImage == null || _selfieImage == null) {
      return;
    }
    final nationalIdResponse = await HttpClient.uploadKyc(filePath: _nationalIdImage.path, type: "national-id");
    // print("national id: ${nationalIdResponse.statusCode}");
    final selfieResponse = await HttpClient.uploadKyc(filePath: _selfieImage.path, type: "selfie");
    // print("selfie: ${selfieResponse.statusCode}");
    Navigator.pushReplacement(context, AuthenticationPage.route(null));
  }

  Future getImage(String type, ImageSource source) async {
    final pickedFile = await picker.getImage(source: source);
    if (pickedFile == null) {
      return;
    }
    setState(() {
      switch (type) {
        case "nationalId":
          _nationalIdImage = File(pickedFile.path);
          break;
        case "selfie":
          _selfieImage = File(pickedFile.path);
          break;
        default:
          print("invalid type");
          break;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthenticationBloc, AuthenticationState>(builder: (ctx, state) {
      return SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.symmetric(vertical: 64, horizontal: 32),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              _nationalIdImage == null ? Text('No image selected.') : Image.file(_nationalIdImage),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  OutlineButton(
                    onPressed: () => getImage('nationalId', ImageSource.gallery),
                    child: Text('Pick'),
                  ),
                  OutlineButton(
                    onPressed: () => getImage('nationalId', ImageSource.camera),
                    child: Text('Take'),
                  ),
                ],
              ),
              _selfieImage == null ? Text('No image selected.') : Image.file(_selfieImage),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  OutlineButton(
                    onPressed: () => getImage('selfie', ImageSource.gallery),
                    child: Text('Pick'),
                  ),
                  OutlineButton(
                    onPressed: () => getImage('selfie', ImageSource.camera),
                    child: Text('Take'),
                  ),
                ],
              ),
              RaisedButton(
                onPressed: () => submitKycImages(context),
                child: Text("Submit"),
              ),
              RaisedButton(
                onPressed: () {
                  ctx.read<AuthenticationBloc>().add(AuthenticationLogoutRequested());
                },
                child: Text("Logout"),
              )
            ],
          ),
        ),
      );
    });
  }
}
